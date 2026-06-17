from django.shortcuts import render

# Create your views here.

def landing_page(request):
    context = {}
    return render(request, "frontend/select_profile.html", context)