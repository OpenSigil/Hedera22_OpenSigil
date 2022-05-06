from rest_framework import routers

from sigil_app.viewsets import (
    EncryptViewSet,
    DecryptViewSet,
    HederaViewSet,
    HederaListViewSet,
    HederaAddViewSet,
    HederaRevokeViewSet,
)

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"encrypt", EncryptViewSet, basename="encrypt")
router.register(r"decrypt", DecryptViewSet, basename="decrypt")
router.register(r"hedera", HederaViewSet, basename="hedera")
router.register(r"list-access", HederaListViewSet, basename="hedera")
router.register(r"add-access", HederaAddViewSet, basename="hedera")
router.register(r"revoke-access", HederaRevokeViewSet, basename="hedera")

urlpatterns = [
    *router.urls,
]
