"""
Typically includes top-level URLs for the Django project, 
including admin URLs (`admin/`), 
authentication URLs (`accounts/`), 
and possibly API endpoints (`api/`)
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from races import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),  # Include auth URLs
    path('auth/', include('races.urls')),
    path('races/', include('races.urls')),  # Include races app URLs
    path('api/', include('races.urls')),  # Include your app's URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)