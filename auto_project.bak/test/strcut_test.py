import struct
import binascii

values = (1, 'abc', 2.7)
s = struct.Struct('I3sf')

puck = s.pack(*values)
print binascii.hexlify(puck)
unpuck = s.unpack(puck)
print unpuck

import traceback

try:
    1/0
except Exception as e:
    traceback.print_exc()