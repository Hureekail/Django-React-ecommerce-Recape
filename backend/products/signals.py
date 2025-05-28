from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Product, ProductCategory
from django.core.cache import cache
from django_redis import get_redis_connection

@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, instance, **kwargs):

    cache.delete_pattern("*product_list*")

@receiver([post_save, post_delete], sender=ProductCategory)
def invalidate_product_cache(sender, instance, **kwargs):

    cache.delete_pattern('*product_category_list*')