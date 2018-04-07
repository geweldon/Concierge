from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from . import ip_config
import requests
import json



def graphql_request(request):
    if request.method == 'POST':
        data = request.body
        headers = {'Content-Type':'application/graphql'}
        response = requests.post(ip_config.CD_IP+'/graphql',
        data = data, headers = headers)
    return HttpResponse(response.text, content_type='application/graphql')

@csrf_exempt
def set_concierge_ip(request):
    data = json.loads(request.body.decode("utf-8"))
    print(ip_config.CD_IP)
    ip_config.CD_IP = data['ip']
    print(ip_config.CD_IP)
    return HttpResponse(status=204)
