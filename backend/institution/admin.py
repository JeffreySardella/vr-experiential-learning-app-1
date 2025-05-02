from django.contrib import admin

from .models import Announcement
from .models import Course
from .models import Institution
from .models import Program

admin.site.register(Institution)
admin.site.register(Program)
admin.site.register(Course)
admin.site.register(Announcement)
