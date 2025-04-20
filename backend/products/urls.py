from django.urls import path
from .views import ProductListView, ProductCategoryView, OrderAddView


urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('categories/', ProductCategoryView.as_view(), name='product-category'),
    path('add-order/', OrderAddView.as_view(), name='order-add'),
]