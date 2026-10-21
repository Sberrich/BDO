from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    data = {"detail": response.data, "code": status.HTTP_400_BAD_REQUEST, "errors": {}}
    if isinstance(response.data, dict):
        detail = response.data.get("detail")
        if detail is not None and len(response.data) == 1:
            data = {
                "detail": detail,
                "code": response.status_code,
                "errors": {},
            }
        else:
            data = {
                "detail": "Validation failed." if response.status_code == 400 else "Request failed.",
                "code": response.status_code,
                "errors": {
                    k: (v if isinstance(v, list) else [str(v)])
                    for k, v in response.data.items()
                    if k != "detail"
                },
            }
            if "detail" in response.data:
                data["detail"] = response.data["detail"]
    elif isinstance(response.data, list):
        data = {"detail": response.data[0] if response.data else "Error", "code": response.status_code, "errors": {}}
    else:
        data = {"detail": str(response.data), "code": response.status_code, "errors": {}}

    response.data = data
    return response
