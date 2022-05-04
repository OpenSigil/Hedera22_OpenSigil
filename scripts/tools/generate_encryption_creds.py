import secrets

import tinyec.ec as ec
from tinyec import registry

curve = registry.get_curve('brainpoolP256r1')
private_key = secrets.randbelow(curve.field.n)
print(f"PRIVATE_KEY: {private_key}")
encryption_pub_key = private_key * curve.g
cipher_priv_key = secrets.randbelow(curve.field.n)
print(f"CIPHER_PRIVATE_KEY: {cipher_priv_key}")
decryption_pub_key = cipher_priv_key * curve.g
ecc_curve_x = decryption_pub_key.x
print(f"ECC_POINT_X: {ecc_curve_x}")
ecc_curve_y = decryption_pub_key.y
print(f"ECC_POINT_Y: {ecc_curve_y}")


