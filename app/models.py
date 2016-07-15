from app import db

class Favorites(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	project_key = db.Column(db.String(120), index=True, unique=True)
	username = db.Column(db.String(120), index=True, unique=True)

	class Meta:
		verbose_name = "FAVORITE"
		verbose_name_plural = "FAVORITEs"

	def __str__(self):
		return "Project %s" % project_key
