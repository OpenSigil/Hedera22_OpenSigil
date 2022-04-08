from django.urls import path, include

urlpatterns = [
    path("api/users/", include(("api.routers", "api"), namespace="api")),
    #path("api/sigil/", include(("api.routers", "api"), namespace="api")),
    path("api/sigil/", include(("sigil_app.routers", "api"), namespace="api")),
]