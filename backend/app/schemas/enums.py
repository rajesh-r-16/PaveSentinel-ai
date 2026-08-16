from enum import Enum

class ReportStatus(str, Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"