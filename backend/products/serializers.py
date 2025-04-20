from rest_framework import serializers
from .models import Product, ProductCategory, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'


class OrderAddSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    class Meta:
        model = Order
        fields = ['product_id']

    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        request = self.context.get('request')
        
        if request.user.is_authenticated:
            order = Order.objects.create(product=product, user=request.user)
        else:
            # Ensure session exists
            if not request.session.session_key:
                request.session.create()
            order = Order.objects.create(product=product, session_key=request.session.session_key)
        
        return order
