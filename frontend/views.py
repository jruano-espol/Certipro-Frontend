from django.shortcuts import render
from django.conf import settings

# Create your views here.
def select_profile(request):
    return render(request, "frontend/select_profile.html", {})

api_url = settings.API_URL

def login(request):
    url_role = request.GET.get('role', 'admin').lower()
    mapping = {
        'admin': 'Administrador',
        'supervisor': 'Supervisor',
        'member': 'Miembro de Equipo',
    }
    assert(url_role in mapping)
    role = mapping.get(url_role, 'Miembro de Equipo')

    context = {
        'role': role,
        'api_url': api_url,
    }

    return render(request, "frontend/login.html", context)

def dashboard(request):
    return render(request, "frontend/dashboard.html", {'api_url': api_url})

def dashboard_member(request):
    return render(request, "frontend/dashboard-member.html", {'api_url': api_url})

def certification_models(request):
    return render(request, "frontend/certification-models.html", {'api_url': api_url})

def new_certification_model(request):
    return render(request, "frontend/new-certification-model.html", {'api_url': api_url})

def tareas(request):
    return render(request, "frontend/tareas.html", {'api_url': api_url})

def principal_miembro(request):
    return render(request, "frontend/principal_miembro.html", {'api_url': api_url})