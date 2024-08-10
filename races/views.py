import json
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Address, Race, State, WishlistItem, ExternalRace
from .serializers import RaceSerializer, StateSerializer, WishlistItemSerializer, ExternalRaceSerializer
from .forms import UserRegistrationForm
from rest_framework import generics
from django.db.models import Q
from datetime import datetime
import requests


API_URL = 'https://runsignup.com/rest/races'
API_KEY = 'jbYGSeWZsYRkBpuqjDPfyyjM5KNh2e1H'

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse the JSON data
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "success": True,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh)
                })
            else:
                errors = dict(form.errors.items())
                return Response({"success": False, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({"success": False, "errors": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=username, password=password)

            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    "success": True,
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh)
                })
            else:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# Get user races
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_races(request):
    print(f"Authenticated User: {request.user.username}")
    races = Race.objects.filter(user=request.user).select_related('state')
    serializer = RaceSerializer(races, many=True, context={'request': request})
    return Response(serializer.data)


# Add a user created completed race
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_race(request):
    print("Request received at add_race endpoint")
    serializer = RaceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()  # Do not pass the user here
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get states
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_states(request):
    states = State.objects.all()
    serializer = StateSerializer(states, many=True, context={'request': request})
    return Response(serializer.data)


# Delete a race from completed races
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_race(request, race_id):
    try:
        race = Race.objects.get(id=race_id, user=request.user)
        race.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Race.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Edit a race
@api_view(['PUT'])
def race_detail(request, pk):
    try:
        race = Race.objects.get(pk=pk)
    except Race.DoesNotExist:
        return Response(status=404)

    if request.method == 'PUT':
        serializer = RaceSerializer(race, data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("Updated Race Serializer Data:", serializer.data) 
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    


def convert_to_date(date_str):
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').date()
    except (ValueError, TypeError):
        return None
    
# Add an external race to wishlist
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    user = request.user
    race_data = request.data.get('race')
    
    # Parse dates
    next_date = datetime.strptime(race_data.get('next_date'), '%Y-%m-%d').date()
    last_date = race_data.get('last_date')
    if last_date:
        last_date = datetime.strptime(last_date, '%Y-%m-%d').date()

    # Create or get Address
    address_data = race_data.get('address')
    address, created_address = Address.objects.get_or_create(
        street=address_data['street'],
        street2=address_data.get('street2', ''),
        city=address_data['city'],
        state=address_data['state'],
        zipcode=address_data['zipcode'],
        country_code=address_data['country_code']
    )

    # Create or get ExternalRace
    external_race, created_race = ExternalRace.objects.get_or_create(
        race_id=race_data['race_id'],
        defaults={
            'name': race_data['name'],
            'last_date': last_date,
            'last_end_date': last_date,
            'next_date': next_date,
            'next_end_date': next_date,
            'is_draft_race': race_data['is_draft_race'],
            'is_private_race': race_data['is_private_race'],
            'is_registration_open': race_data['is_registration_open'],
            'created': race_data['created'],
            'last_modified': race_data['last_modified'],
            'description': race_data['description'],
            'url': race_data['url'],
            'external_race_url': race_data['external_race_url'],
            'external_results_url': race_data['external_results_url'],
            'fb_page_id': race_data['fb_page_id'],
            'fb_event_id': race_data['fb_event_id'],
            'address': address,
            'timezone': race_data['timezone'],
            'logo_url': race_data['logo_url'],
            'real_time_notifications_enabled': race_data['real_time_notifications_enabled'],
        }
    )

    # Add to wishlist
    if not WishlistItem.objects.filter(user=user, external_race=external_race).exists():
        WishlistItem.objects.create(user=user, external_race=external_race)

    return JsonResponse({'message': 'Race added to wishlist'}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    user = request.user
    wishlist_items = WishlistItem.objects.filter(user=user)
    wishlist_data = []

    for item in wishlist_items:
        if item.external_race is not None:
            wishlist_data.append({
                'race_id': item.external_race.race_id,
                'name': item.external_race.name,
                'next_date': item.external_race.next_date,
                'address': {
                    'street': item.external_race.address.street,
                    'city': item.external_race.address.city,
                    'state': item.external_race.address.state,
                    'zipcode': item.external_race.address.zipcode,
                    'country_code': item.external_race.address.country_code
                },
                'logo_url': item.external_race.logo_url,
                'description': item.external_race.description,
                'url': item.external_race.url,
                'external_race_url': item.external_race.external_race_url,
                'added_at': item.added_at.isoformat()
            })

    return JsonResponse({'wishlist': wishlist_data}, status=200)

# Remove an external race from wishlist
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, race_id):
    user = request.user
    try:
        wishlist_item = WishlistItem.objects.get(user=user, external_race__race_id=race_id)
        wishlist_item.delete()
        return JsonResponse({'message': 'Race removed from wishlist'}, status=204)
    except WishlistItem.DoesNotExist:
        return JsonResponse({'error': 'Race not found in wishlist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

