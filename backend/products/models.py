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