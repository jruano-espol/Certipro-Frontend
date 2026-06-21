from django.urls import path

from . import views

urlpatterns = [
    path("", views.select_profile, name="select_profile"),
    path("login/", views.login, name="login"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("tareas/", views.tareas, name="tareas"),
    path("principal_miembro/", views.principal_miembro, name="principal_miembro")
]