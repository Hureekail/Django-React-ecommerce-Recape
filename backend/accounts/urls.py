from django.urls import include, path
from .views import csrf_token_view, GetCSRFToken, DeleteProfileView

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('auth/csrf/', GetCSRFToken.as_view(), name='csrf'),
    
    path('accounts/delete-profile/', DeleteProfileView.as_view(), name="delete-profile"),
]