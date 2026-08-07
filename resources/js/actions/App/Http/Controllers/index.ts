import DashboardController from './DashboardController'
import DocumentController from './DocumentController'
import ArchiveReportController from './ArchiveReportController'
import UserController from './UserController'
import TemplateController from './TemplateController'
import CategoryNumberingController from './CategoryNumberingController'
import StudentController from './StudentController'
import TeacherController from './TeacherController'
import HeadmasterController from './HeadmasterController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
DocumentController: Object.assign(DocumentController, DocumentController),
ArchiveReportController: Object.assign(ArchiveReportController, ArchiveReportController),
UserController: Object.assign(UserController, UserController),
TemplateController: Object.assign(TemplateController, TemplateController),
CategoryNumberingController: Object.assign(CategoryNumberingController, CategoryNumberingController),
StudentController: Object.assign(StudentController, StudentController),
TeacherController: Object.assign(TeacherController, TeacherController),
HeadmasterController: Object.assign(HeadmasterController, HeadmasterController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers