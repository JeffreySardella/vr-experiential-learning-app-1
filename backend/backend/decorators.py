# Ref: https://stackoverflow.com/a/58239465
def method_permission_classes(classes):
    """
    Decorator that allots us to specify permission_classes on a per-method basis for class-based API Views.

    By default, djangorestframework only allows setting `permission_classes` for the whole class and all its methods:
    https://www.django-rest-framework.org/api-guide/permissions/#setting-the-permission-policy
    """
    def decorator(func):
        def decorated_func(self, *args, **kwargs):
            self.permission_classes = classes
            self.check_permissions(self.request)
            return func(self, *args, **kwargs)
        return decorated_func
    return decorator
