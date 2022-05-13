from rest_framework import routers

from sigil_app.viewsets import (
    EncryptViewSet,
    DbAddRecord,
    DbReturnRecord,
    DecryptViewSet,
    HederaEncryptViewSet,
    HederaDecryptViewSet,
    HederaListViewSet,
    HederaAddViewSet,
    HederaRevokeViewSet,
    IPFSUploadViewSet,
    IPFSDownloadViewSet
)

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"encrypt", EncryptViewSet, basename="encrypt")
router.register(r"decrypt", DecryptViewSet, basename="decrypt")
router.register(r"hedera-encrypt", HederaEncryptViewSet, basename="hedera")
router.register(r"hedera-decrypt", HederaDecryptViewSet, basename="hedera")
router.register(r"list-access", HederaListViewSet, basename="hedera")
router.register(r"add-access", HederaAddViewSet, basename="hedera")
router.register(r"revoke-access", HederaRevokeViewSet, basename="hedera")
router.register(r"add-record", DbAddRecord, basename="db")
router.register(r"get-record", DbReturnRecord, basename="db")

# IPFS Routes
router.register(r"upload", IPFSUploadViewSet, basename="db")
router.register(r"download", IPFSDownloadViewSet, basename="db")

urlpatterns = [
    *router.urls,
]
