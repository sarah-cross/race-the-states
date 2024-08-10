from rest_framework import serializers
from .models import Race, State, Address, ExternalRace, WishlistItem

class StateSerializer(serializers.ModelSerializer):
    flag_image = serializers.SerializerMethodField()

    class Meta:
        model = State
        fields = ['id', 'name', 'abbreviation', 'flag_image', 'region']

    def get_flag_image(self, obj):
        request = self.context.get('request')
        if request is None or not obj.flag_image: 
            return None 
        
        if obj.flag_image and request:
            flag_image_url = request.build_absolute_uri(obj.flag_image.url)
            #print(f"State Serializer: State ID - {obj.id}, Name - {obj.name}, Flag Image URL - {flag_image_url}")
            return flag_image_url
        return None


class RaceSerializer(serializers.ModelSerializer):
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())  

    class Meta:
        model = Race
        fields = ['id', 'race_name', 'city', 'state', 'race_date', 'race_time', 'race_notes', 'race_images', 'user']
        extra_kwargs = {
            'id': {'read_only': True},  
            'user': {'read_only': True},  
        }

    def to_representation(self, instance):
        """
        Override to_representation to include state details using StateSerializer.
        """
        representation = super().to_representation(instance)
        state_instance = instance.state
        state_serializer = StateSerializer(state_instance, context=self.context)
        representation['state'] = state_serializer.data
        #print("Race Serializer Representation", representation)
        return representation

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        state_instance = validated_data.pop('state')
        #print(f"State instance found: {state_instance}")  # Print retrieved state instance
        race = Race.objects.create(state=state_instance, user=user, **validated_data)
        #print(f"Created race instance: {race}")  # Print created race instance
        return race
    
    
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class ExternalRaceSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = ExternalRace
        fields = '__all__'

class WishlistItemSerializer(serializers.ModelSerializer):
    external_race = ExternalRaceSerializer()

    class Meta:
        model = WishlistItem
        fields = '__all__'