from django.urls import path
from .views import ProductListView, ProductCategoryView


urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('categories/', ProductCategoryView.as_view(), name='product-category')
]