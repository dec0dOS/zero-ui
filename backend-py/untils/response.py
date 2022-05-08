from dataclasses import dataclass, field

@dataclass
class Response():
	"""Default Response für Frontend"""
	
	success  : int
	message  : str
	data     : list = field(default=None)