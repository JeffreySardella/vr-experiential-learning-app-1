from typing import List

from allauth.account.forms import default_token_generator
from allauth.account.utils import user_pk_to_url_str
from django.contrib.auth.models import Group

from .constants import ADMIN_GROUP_NAME
from .constants import INSTRUCTOR_GROUP_NAME
from .models import User


def set_user_group(user: User, group_name: str) -> User:
    group, _ = Group.objects.get_or_create(name=group_name)
    user.groups.add(group)
    return user


def set_user_institution_id(user: User, institution_id: int) -> User:
    from institution.apis import InternalInstitutionApi
    institution = InternalInstitutionApi.retrieve_institution(institution_id)
    user.institution = institution
    return user


def set_user_program_ids(user, program_ids: List[int]) -> User:
    from institution.apis import InternalInstitutionApi
    programs = InternalInstitutionApi.retrieve_programs_by_id(program_ids)
    for p in programs:
        user.programs.add(p)
    return user


def _create_new_invited_user(email: str, institution_id: int) -> User:
    user = User.objects.create_user(email)
    user.is_active = False
    user = set_user_institution_id(user, institution_id)
    return user


def invite_admin_user(email: str, institution_id: int) -> User:
    user = _create_new_invited_user(email, institution_id)
    user = set_user_group(user, ADMIN_GROUP_NAME)
    return user


def invite_instructor_user(email: str, institution_id: int) -> User:
    user = _create_new_invited_user(email, institution_id)
    user = set_user_group(user, INSTRUCTOR_GROUP_NAME)
    return user


def generate_invite_token(user: User) -> str:
    """
    This implementation uses the default_token_generator from allauth
    """
    return default_token_generator.make_token(user)


def _generate_base_invite_url(user: User, route: str) -> str:
    token = generate_invite_token(user)
    uid = user_pk_to_url_str(user)
    return f"http://localhost:3000/{route}?token={token}&uid={uid}"


def generate_admin_invite_url(user) -> str:
    return _generate_base_invite_url(user, "auth/admin/signup")


def generate_instructor_invite_url(user) -> str:
    url = _generate_base_invite_url(user, "auth/instructor/signup")
    url += f"&institution_id={user.institution.id}"
    return url


def get_user_by_email(email: str) -> User:
    return User.objects.filter(email=email)
