from django.urls import path, include

urlpatterns = [
    path("api/sigil/", include(("sigil_app.routers", "api"), namespace="api")),
]