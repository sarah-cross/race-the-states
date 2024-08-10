from django.contrib import admin
from .models import State, Race, Address, ExternalRace, WishlistItem

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('name', 'abbreviation', 'region')

@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    list_display = ('race_name', 'state', 'user', 'race_date')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('street', 'city', 'state', 'country_code', 'zipcode')

@admin.register(ExternalRace)
class ExternalRaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'race_id', 'next_date', 'url')

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'external_race', 'added_at')
