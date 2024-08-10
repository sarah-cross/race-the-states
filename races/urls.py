"""
Handles URLs specific to races, such as
'race-checklist', 'add-race' and any other
race-related functionalities 
"""

from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register_view, name='register'), 
    path('auth/login/', views.login_view, name='login'),
    path('states/', views.get_states, name='states'),
    path('add-race/', views.add_race, name='add-race'),
    path('user-races/', views.user_races, name='user-races'),
    path('delete-race/<int:race_id>/', views.delete_race, name='delete_race'),
    path('races/<int:pk>/', views.race_detail, name='race-detail'),
    path('wishlist/add/', views.add_to_wishlist, name='wishlist-add'),
    path('wishlist/', views.get_wishlist, name='wishlist'),
    path('wishlist/<int:race_id>/remove/', views.remove_from_wishlist, name='remove_from_wishlist'),
    #path('find-races', views.find_external_races, name='find-races')
] 
