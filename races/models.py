from django.db import models
from django.contrib.auth.models import User


class State(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=2)
    flag_image = models.ImageField(upload_to='flags/', null=True, blank=True)
    region = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


"""This is a race a user has completed"""
class Race(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100, blank=True, null=True) 
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    race_date = models.DateField(null=True, blank=True)
    race_name = models.CharField(max_length=200)
    race_notes = models.TextField(blank=True, null=True)  # Field for user notes
    race_time = models.DurationField(blank=True, null=True)
    race_images = models.ImageField(upload_to='race_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.state.name} - {self.race_name}"



class Address(models.Model):
    street = models.CharField(max_length=255, null=True, blank=True)
    street2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    country_code = models.CharField(max_length=2, default="US", null=True, blank=True)
    zipcode = models.CharField(max_length=20, null=True, blank=True)

class ExternalRace(models.Model):
    race_id = models.IntegerField()
    name = models.CharField(max_length=255)
    last_date = models.DateField(null=True, blank=True)
    last_end_date = models.DateField(null=True, blank=True)
    next_date = models.DateField(null=True, blank=True)
    next_end_date = models.DateField(null=True, blank=True)
    is_draft_race = models.CharField(max_length=5)  # Change this if needed
    is_private_race = models.CharField(max_length=5)  # Change this if needed
    is_registration_open = models.CharField(max_length=5)  # Change this if needed
    created = models.DateTimeField(null=True, blank=True)
    last_modified = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    external_race_url = models.URLField(null=True, blank=True)
    external_results_url = models.URLField(null=True, blank=True)
    fb_page_id = models.CharField(max_length=255, null=True, blank=True)
    fb_event_id = models.CharField(max_length=255, null=True, blank=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, null=True, blank=True)
    timezone = models.CharField(max_length=255, null=True, blank=True)
    logo_url = models.URLField(null=True, blank=True)
    real_time_notifications_enabled = models.CharField(max_length=5)  # Change this if needed

    def __str__(self):
        return self.name



    

class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    external_race = models.ForeignKey(ExternalRace, null=True, blank=True, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.user.username} - {self.external_race.name}"
