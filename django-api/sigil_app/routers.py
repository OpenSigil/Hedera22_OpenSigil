from rest_framework import routers

from sigil_app.viewsets import (
    EncryptViewSet,
    DecryptViewSet
)

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"encrypt", EncryptViewSet, basename="encrypt")
router.register(r"decrypt", DecryptViewSet, basename="decrypt")


urlpatterns = [
    *router.urls,
]
