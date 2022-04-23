from rest_framework import routers

from sigil_app.viewsets import (
    EncryptViewSet,
    DecryptViewSet,
    HederaViewSet
)

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"encrypt", EncryptViewSet, basename="encrypt")
router.register(r"decrypt", DecryptViewSet, basename="decrypt")
router.register(r"hedera", HederaViewSet, basename="hedera")

urlpatterns = [
    *router.urls,
]
