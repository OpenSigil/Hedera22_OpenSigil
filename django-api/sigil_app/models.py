import base64
import hashlib
import pickle
import secrets
import os

from cryptography.fernet import Fernet
from django.db import models
from django.conf import settings
from tinyec import registry
from django.http import HttpResponse

class Encrypt():
    def __init__(self):
        self._private_key = settings.ENCRYPT_PRIVATE_KEY
        self._curve = registry.get_curve('brainpoolP256r1')

    def __encrypt_Fernet_GCM(self, msg, secret_key):
        f = Fernet(secret_key)
        token = f.encrypt(msg)
        return token

    def __ecc_point_to_256_bit_key(self, point):
        sha = hashlib.sha256(int.to_bytes(point.x, 32, 'big'))
        sha.update(int.to_bytes(point.y, 32, 'big'))
        return  base64.urlsafe_b64encode(sha.digest())

    def __encrypt_ECC(self, msg, public_key):
        msg = msg.read()
        ciphertextprivate_key = secrets.randbelow(self._curve.field.n)
        sharedECCKey = ciphertextprivate_key * public_key
        secret_key = self.__ecc_point_to_256_bit_key(sharedECCKey)
        ciphertext = self.__encrypt_Fernet_GCM(msg, secret_key)
        cipher_pub_key = ciphertextprivate_key * self._curve.g
        return (ciphertext, cipher_pub_key)

    def __load_file(self, input_file):
        destination = open('tempfile', 'wb')
        for chunk in input_file.chunks():
            destination.write(chunk)
        destination.close()
        return(open("tempfile", "rb"))

    def __write_file(self, input_file):
        destination = open('encryptedfile', 'wb')
        destination.write(input_file)
        return(open("encryptedfile", "rb"))

    def encrypt_file(self, input_file):
        file_obj = self.__load_file(input_file)
        _encryption_pub_key = int(self._private_key) * self._curve.g
        encrypted_msg, decryption_pub_key = self.__encrypt_ECC(file_obj, _encryption_pub_key)
        self.__write_file(encrypted_msg)
        if os.path.exists('encryptedfile'):
            with open('encryptedfile', 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/octet-stream")
                response['Content-Disposition'] = 'inline; filename=' + 'encryptedfile'
                print(f'Response: {response}')
                return response
        