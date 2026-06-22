from django.urls import path

from . import views

urlpatterns = [
    path("", views.select_profile, name="select_profile"),
    path("login/", views.login, name="login"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("dashboard_member/", views.dashboard_member, name="dashboard_member"),
    path("certification_models/", views.certification_models, name="certification_models"),
    path("new_certification_model/", views.new_certification_model, name="new_certification_model"),
    path("tareas/", views.tareas, name="tareas"),
    path("principal_miembro/", views.principal_miembro, name="principal_miembro")
]