from django.shortcuts import render

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, ProductCategory, Order
from .serializers import ProductSerializer, ProductCategorySerializer, OrderAddSerializer

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class ProductListView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(cache_page(60 * 60, key_prefix='product_list'))
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductCategoryView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(cache_page(60 * 60, key_prefix='product_category_list'))
    def get(self, request):
        products = ProductCategory.objects.all()
        serializer = ProductCategorySerializer(products, many=True)
        return Response(serializer.data)


class OrderAddView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrderAddSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class TransferSessionOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_key = request.data.get('session_key')
        if not session_key:
            return Response({'error': 'Session key is required'}, status=400)

        try:
            Order.transfer_session_orders_to_user(session_key, request.user)
            return Response({'message': 'Orders transferred successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
