import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import StudentSyncController from './StudentSyncController'
import TeacherSyncController from './TeacherSyncController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
StudentSyncController: Object.assign(StudentSyncController, StudentSyncController),
TeacherSyncController: Object.assign(TeacherSyncController, TeacherSyncController),
}

export default Settings