from typing import List

from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import Institution
from .models import Program


def validate_institution_id(institution_id: int) -> int:
    if not Institution.objects.filter(id=institution_id):
        raise serializers.ValidationError(
            _('Invalid institution_id'),
        )
    return institution_id


def validate_program_ids(program_ids: List[int]) -> List[int]:
    validated_ids = []
    for program_id in program_ids:
        try:
            Program.objects.get(id=program_id)
            validated_ids.append(program_id)
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                _(f'Invalid program_id: {program_id}'),
            )
    return validated_ids
