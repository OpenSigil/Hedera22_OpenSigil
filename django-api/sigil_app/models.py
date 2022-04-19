import base64
import hashlib
import secrets
import tinyec.ec as ec
import tinyec.registry as reg
import os

from cryptography.fernet import Fernet
from django.db import models
from django.conf import settings
from django.http import HttpResponse

class Encrypt():
    def __init__(self):
        self._private_key = int(settings.ENCRYPT_PRIVATE_KEY)
        self._cipher_private_key = int(settings.CIPHER_PRIVATE_KEY)
        self._ecc_point_x = int(settings.ECC_POINT_X)
        self._ecc_point_y = int(settings.ECC_POINT_Y)
        self._curve = reg.get_curve('brainpoolP256r1')

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
        ciphertextprivate_key = self._cipher_private_key
        sharedECCKey = ciphertextprivate_key * public_key
        secret_key = self.__ecc_point_to_256_bit_key(sharedECCKey)
        ciphertext = self.__encrypt_Fernet_GCM(msg, secret_key)
        cipher_pub_key = ciphertextprivate_key * self._curve.g
        return (ciphertext, cipher_pub_key)
    
    def __decrypt_Fernet_GCM(self, token, secret_key):
        f = Fernet(secret_key)
        token = token.read()
        try:
            plaintext = f.decrypt(token)
        except Exception as e:
            print(f'Decryption Failed: {e}')
        return plaintext

    def __decrypt_ECC(self, encrypted_msg, cipher_pub_key, private_key):
        sharedECCKey = private_key * cipher_pub_key
        secret_key = self.__ecc_point_to_256_bit_key(sharedECCKey)
        plaintext = self.__decrypt_Fernet_GCM(encrypted_msg, secret_key)
        return plaintext

    def __load_file(self, input_file):
        destination = open('tempfile', 'wb')
        for chunk in input_file.chunks():
            destination.write(chunk)
        destination.close()
        return(open("tempfile", "rb"))

    def __write_file(self, input_file, output_file):
        destination = open(output_file, 'wb')
        destination.write(input_file)
        return(open(output_file, "rb"))

    def encrypt_file(self, input_file):
        file_obj = self.__load_file(input_file)
        _encryption_pub_key = int(self._private_key) * self._curve.g
        encrypted_msg, decryption_pub_key = self.__encrypt_ECC(file_obj, _encryption_pub_key)
        self.__write_file(encrypted_msg, 'encryptedfile')
        if os.path.exists('encryptedfile'):
            with open('encryptedfile', 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/octet-stream")
                response['Content-Disposition'] = 'inline; filename=' + 'encryptedfile'
                print(f'Response: {response}')
                return response
    
    def decrypt_file(self, input_file):
        file_obj = self.__load_file(input_file)
        decryption_pub_key = ec.Point(self._curve, self._ecc_point_x, self._ecc_point_y)
        decrypted_msg = self.__decrypt_ECC(file_obj, decryption_pub_key, self._private_key)
        self.__write_file(decrypted_msg, 'decryptedfile')
        if os.path.exists('decryptedfile'):
            with open('decryptedfile', 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/octet-stream")
                response['Content-Disposition'] = 'inline; filename=' + 'decryptedfile'
                print(f'Response: {response}')
                return response