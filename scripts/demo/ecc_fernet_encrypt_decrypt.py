import base64
import hashlib
import secrets
import pickle

from cryptography.fernet import Fernet
import tinyec.ec as ec
from tinyec import registry

def encrypt_Fernet_GCM(msg, secret_key):
    f = Fernet(secret_key)
    token = f.encrypt(msg)
    return token

def decrypt_Fernet_GCM(token, secret_key):
    f = Fernet(secret_key)
    plaintext = f.decrypt(token)
    return plaintext

def ecc_point_to_256_bit_key(point):
    sha = hashlib.sha256(int.to_bytes(point.x, 32, 'big'))
    sha.update(int.to_bytes(point.y, 32, 'big'))
    return  base64.urlsafe_b64encode(sha.digest())

def encrypt_ECC(msg, cipher_priv_key, public_key):
    sharedECCKey = cipher_priv_key * public_key
    secret_key = ecc_point_to_256_bit_key(sharedECCKey)
    ciphertext = encrypt_Fernet_GCM(msg, secret_key)
    cipher_pub_key = cipher_priv_key * curve.g
    return (ciphertext, cipher_pub_key)

def decrypt_ECC(encrypted_msg, cipher_pub_key, private_key):
    sharedECCKey = private_key * cipher_pub_key
    secret_key = ecc_point_to_256_bit_key(sharedECCKey)
    plaintext = decrypt_Fernet_GCM(encrypted_msg, secret_key)
    return plaintext

# Utilizes a hybrid asymmetric encryption scheme based the Elliptic curve cryptography scheme. RSA & ECC are two of the most cryptographically secure asymmetric encryption schemes, with ECC being sigificantly more efficient. Because of limitiations of ECC and Asymetric encryption as a whole, our use case requres a hybrid encryption scheme utilizing ECC for key exchange to derive a shared secret key for symmetric data encryption & decryption. (In this case asym ECC & sym FERNET)
 
# Based on Svetlin Nakov's Practical Cryptography for Developers https://cryptobook.nakov.com/asymmetric-key-ciphers/ecies-public-key-encryption
curve = registry.get_curve('brainpoolP256r1')
msg = b'Hello World!'
print(f"Original Message: {msg}")
private_key = secrets.randbelow(curve.field.n)
print(f"Private Key: {private_key}")
encryption_pub_key = private_key * curve.g
print(f"Encryption Public Key: {encryption_pub_key}")
cipher_priv_key = secrets.randbelow(curve.field.n)
print(f"Cipher Private Key: {cipher_priv_key}")
encrypted_msg, decryption_pub_key = encrypt_ECC(msg, cipher_priv_key, encryption_pub_key)
print(f"Encrypted Msg: {encrypted_msg}")
ecc_curve_x = decryption_pub_key.x
ecc_curve_y = decryption_pub_key.y
print(f"X: {ecc_curve_x}")
print(f"Y: {ecc_curve_y}")
print(decryption_pub_key)
print(f"Decryption Public Key: {decryption_pub_key}")
curve = registry.get_curve('brainpoolP256r1')
t = ec.Point(curve, ecc_curve_x, ecc_curve_y)
print(f"Remade Decryption Public Key: {t}")
decrypted_msg = decrypt_ECC(encrypted_msg, t, private_key)
print(f"Decrypted Message: {decrypted_msg}")

