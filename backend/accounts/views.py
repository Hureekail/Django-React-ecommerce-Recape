from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status


@api_view(['GET'])
def csrf_token_view(request):

    csrf_token = get_token(request)
    return Response({'csrf_token': csrf_token})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return JsonResponse({'success': 'CSRF cookie set'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class DeleteProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        try:
            user = request.user
            user.delete()
            return Response({'message': 'Profile successfully deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
