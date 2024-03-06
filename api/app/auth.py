from fastapi_cloudauth.cognito import CognitoCurrentUser, CognitoClaims
from fastapi import HTTPException, Depends
import os

get_current_user = CognitoCurrentUser(
    region=os.environ["REGION"],
    userPoolId=os.environ["USERPOOLID"],
    client_id=os.environ["APPCLIENTID"]
)


def get_current_user_auth(
    current_user: CognitoClaims = Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return current_user
