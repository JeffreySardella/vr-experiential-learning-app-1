from .models import Video


def create_video(*, video, title, description) -> Video:
    obj = Video(video=video, title=title, description=description)
    obj.full_clean()
    obj.save()
    return obj
