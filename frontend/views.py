from django.shortcuts import render

# Create your views here.

def select_profile(request):
    return render(request, "frontend/select_profile.html", {})

def login(request):
    url_role = request.GET.get('role', 'admin').lower()
    mapping = {
        'admin': 'Administrador',
        'supervisor': 'Supervisor',
        'member': 'Miembro del equipo',
    }
    assert(url_role in mapping)
    role = mapping.get(url_role, 'Administrador')
    return render(request, "frontend/login.html", {'role': role})