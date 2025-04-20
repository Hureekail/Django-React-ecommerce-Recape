from django.db import models


class ProductCategory(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name  = 'category'
        verbose_name_plural = 'categories'


class Product(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='product_images/')
    category = models.ForeignKey(to=ProductCategory, on_delete=models.CASCADE, to_field='name')

    class Meta:
        verbose_name  = 'product'
        verbose_name_plural = 'products'
        ordering = ['-id']

    def __str__(self):
        return f'Product: {self.name} | Category: {self.category.name}'


class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey('accounts.UserAccount', on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)

    class Meta:
        verbose_name = 'order'
        verbose_name_plural = 'orders'


    def __str__(self):
        if self.user:
            return f'Order: {self.product.name} | User: {self.user.email}'
        return f'Order: {self.product.name} | Session: {self.session_key}'

    @classmethod
    def transfer_session_orders_to_user(cls, session_key, user):
        """
        Transfers all session-based orders to a specific user
        """
        session_orders = cls.objects.filter(session_key=session_key)
        for order in session_orders:
            # Check if user already has this product in their orders
            if not cls.objects.filter(product=order.product, user=user).exists():
                order.user = user
                order.session_key = None
                order.save()
            else:
                # If user already has this product, delete the session order
                order.delete()