from rest_framework import routers

from sigil_app.viewsets import (
    EncryptViewSet
)

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"encrypt", EncryptViewSet, basename="encrypt")

urlpatterns = [
    *router.urls,
]
