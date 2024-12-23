import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';
import Handlebars from 'handlebars';

export const addResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let { resume_data, templates_id } = req.body;
        resume_data = JSON.stringify(resume_data);
        const createdAt = utility.utcDate();



        if (!templates_id) {
            return apiResponse.errorMessage(res, 400, "Template is required.");
        }
        const checkTemplate = `SELECT * FROM templates WHERE id = ? AND status = 1`;
                const [template]: any = await pool.query(checkTemplate, [templates_id]);
                if (template.length === 0) {
                  return apiResponse.errorMessage(res, 400, "Template Not Found");
                }

        const sql = `INSERT INTO resumes (user_id, resume_data, templates_id, created_at) VALUES (?, ?, ?, ?)`;
        const VALUES = [userId, resume_data, templates_id, createdAt];
        
        const [result]: any = await pool.query(sql, VALUES);

        const resumeId = result.insertId;

       

        if (!resumeId) {
            return apiResponse.errorMessage(res, 400, "Failed to add resume.");
        }

        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resumeId, userId]);

        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        return apiResponse.successResponse(res, "Resume Added", { id: resumeId });
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
};


// =======================================================================
// =======================================================================

// export const resumeList = async (req: Request, res: Response) => {
//     try {

//         const userId = res.locals.jwt.userId;
//         const sql = `SELECT id, resume_data, url, templates_id FROM resumes WHERE user_id = ${userId} AND deleted_at IS NULL`;
//         const [rows]: any = await pool.query(sql);
//         let fullHtml: any;
        
//         let resumeArrayData: Array<Map<string, any>> = [];
//         if (rows.length > 0) {

//             for (const resume of rows) {
//                 const checkTemplate = `SELECT * FROM templates WHERE id = ? AND status = 1`;
//                 const [template]: any = await pool.query(checkTemplate, [resume.templates_id]);
//                 if (template.length === 0) {
//                   return apiResponse.errorMessage(res, 400, "Template Not Found");
//                 }
               
                

                
//                 const resumeData = JSON.parse(resume.resume_data);
               

//                 const templateData = template[0];
   
//                 const html = templateData.html;
//                 const css = templateData.css;
        
//                 const replaceData = (data: any, find: any, replace: any) => {
//                     return data.replace(find, replace);
//                 };
//                 if (template.length > 0) {
//                     const templateList = template[0];
        
//                     let data: any = {};
//                     data.content = resumeData;
//                     data.style = css;
//                     let content = data.content;
        
        
//                     let dataNew = html;
                    
//                     let tempStyle = data.style;
        
//                     let dataNew1 = `
//                     <html lang="en" dir="ltr">
//                     <head>
//                         <style> ${tempStyle} 
//                         .fa-heart:before {content: "\\f004"} 
//                         .resume_right ul{margin-left: 15px;} 
//                         .resume_exp{display:block;} 
//                         .resume_right ol{margin-left: 15px;} 
//                         .resume_right .resume_references ul{margin-left:0px !important;} 
//                         .resume_right .resume_skills ul{margin-left:0px !important;} 
//                         .resume_right .resume_interest ul{margin-left:0px !important;} 
//                         .resume_right .resume_language ul{margin-left:0px !important;}
//                         </style>
//                     </head>
//                     <body id="resume" cz-shortcut-listen="true" contentEditable="true" spellcheck="true">`;
                      
//                     let dataNew3 = `</body></html>`;
        
//                     if (content?.resumePurpose) {
//                         dataNew = dataNew.replace('{job_position}', content.resumePurpose);
                    
//                     } else {
//                         dataNew = dataNew.replace('{job_position}', '');
//                     }
        
//                     // Email Replacement
//                     if (content?.personaldetails?.email) {
                       
                    
//                         dataNew = dataNew.replace('{email}', content.personaldetails.email);
                        
                    
//                         dataNew = dataNew.replace('{emailone}', `<li> 
//                             <div class="icon"><i class="fas fa-envelope"></i></div>
//                             <div class="data"> ${content.personaldetails.email} </div>
//                         </li>`);
                        
                    
//                         dataNew = dataNew.replace('{emailtwo}', `<li> <div class="data">${content.personaldetails.email}</div>
//                             <div class="icon"><i class="fas fa-envelope"></i></div>
//                         </li>`);
                        
                    
//                         dataNew = dataNew.replace('{emailthree}', `<li><div class="icon">
//                             <i class="fas fa-envelope"></i><span class="data">${content.personaldetails.email}</span>
//                         </div></li>`);
                        
                    
//                         dataNew = dataNew.replace('{emailfour}', `<li class="exper_dot">${content.personaldetails.email}</li>`);
                        
//                     }
//                     else {
//                         dataNew = dataNew.replace('{email}', '');
//                         dataNew = dataNew.replace('{emailone}', '');
//                         dataNew = dataNew.replace('{emailtwo}', '');
//                         dataNew = dataNew.replace('{emailthree}', '');
//                         dataNew = dataNew.replace('{emailfour}', '');
//                     }
        
//                     // Address Replacement
//                     if (content?.personaldetails?.address) {
//                         dataNew = dataNew.replace('{address}', content.personaldetails.address);
//                         dataNew = dataNew.replace('{addresstwo}', `<li class="exper_dot">${content.personaldetails.address}</li>`);
//                         dataNew = dataNew.replace('{addressthree}', `<li> <div class="icon"> <i class="fas fa-map-marker-alt"></i>
//                             </div><div class="data"> ${content.personaldetails.address} </div></li>`);
//                         dataNew = dataNew.replace('{addressfour}', `<li><div class="data"> ${content.personaldetails.address}</div>
//                             <div class="icon"><i class="fas fa-map-marker-alt"></i></div></li>`);
//                         dataNew = dataNew.replace('{addressone}', `<li><div class="icon"><i class="fas fa-map-marker-alt"></i>
//                             <span class="data">${content.personaldetails.address}</span></div></li>`);
//                     } else {
//                         dataNew = dataNew.replace('{address}', '');
//                         dataNew = dataNew.replace('{addresstwo}', '');
//                         dataNew = dataNew.replace('{addressthree}', '');
//                         dataNew = dataNew.replace('{addressfour}', '');
//                         dataNew = dataNew.replace('{addressone}', '');
//                     }
        
//                     // Phone Replacement
//                     if (content?.personaldetails?.phone) {
//                         dataNew = dataNew.replace('{phone}', content.personaldetails.phone);
//                         dataNew = dataNew.replace('{phonedesignone}', `<li><div class="icon"><i class="fas fa-phone-alt"></i></div>
//                             <div class="data"> ${content.personaldetails.phone} </div></li>`);
//                         dataNew = dataNew.replace('{phonedesigntwo}', `<li><div class="data"> ${content.personaldetails.phone} </div>
//                             <div class="icon"><i class="fas fa-phone-alt"></i></div></li>`);
//                         dataNew = dataNew.replace('{phonedesignthree}', `<li><div class="icon"><i class="fas fa-phone-alt"></i>
//                             <span class="data">${content.personaldetails.phone}</span></div></li>`);
//                         dataNew = dataNew.replace('{phonedesignfour}', `<li class="exper_dot">${content.personaldetails.phone}</li>`);
//                     } else {
//                         dataNew = dataNew.replace('{phone}', '');
//                         dataNew = dataNew.replace('{phonedesignone}', '');
//                         dataNew = dataNew.replace('{phonedesigntwo}', '');
//                         dataNew = dataNew.replace('{phonedesignthree}', '');
//                         dataNew = dataNew.replace('{phonedesignfour}', '');
//                     }
        
//                     // Date of Birth Replacement
//                     if (content?.personaldetails?.dob) {
//                         dataNew = dataNew.replace('{dob}', `<li>DOB: ${content.personaldetails.dob}</li>`);
//                         dataNew = dataNew.replace('{dobone}', `<li class="exper_dot">${content.personaldetails.dob}</li>`);
//                         dataNew = dataNew.replace('{dobdesign}', `<li><div class="icon"><i class="fas fa-birthday-cake"></i></div>
//                             <div class="data"> ${content.personaldetails.dob} </div></li>`);
//                         dataNew = dataNew.replace('{dobdesignthree}', `<li><div class="data"> ${content.personaldetails.dob}</div>
//                             <div class="icon"><i class="fas fa-birthday-cake"></i></div></li>`);
//                         dataNew = dataNew.replace('{dobdesignfour}', `<li><div class="icon"><i class="fas fa-birthday-cake"></i>
//                             <span class="data">${content.personaldetails.dob}</span></div></li>`);
//                     } else {
//                         dataNew = dataNew.replace('{dob}', '');
//                         dataNew = dataNew.replace('{dobone}', '');
//                         dataNew = dataNew.replace('{dobdesign}', '');
//                         dataNew = dataNew.replace('{dobdesignthree}', '');
//                         dataNew = dataNew.replace('{dobdesignfour}', '');
//                     }
        
//                     // Nationality
//                     if (content?.personaldetails?.nationality) {
//                         dataNew = replaceData(dataNew, '{nationality}', `<li class="exper_dot"> ${content.personaldetails.nationality} </li>`);
//                         dataNew = replaceData(dataNew, '{nationalitydesign}', `<li><div class="icon"><i class="fas fa-flag"></i></div><div class="data"> ${content.personaldetails.nationality} </div></li>`);
//                         dataNew = replaceData(dataNew, '{nationalitydesigntwo}', `<li><div class="data"> ${content.personaldetails.nationality} </div><div class="icon"><i class="fas fa-flag"></i></div></li>`);
//                         dataNew = replaceData(dataNew, '{nationalitydesignthree}', `<li><div class="icon"><i class="fas fa-flag"></i><span class="data">${content.personaldetails.nationality}</span></div></li>`);
//                     } else {
//                         dataNew = replaceData(dataNew, '{nationality}', '');
//                         dataNew = replaceData(dataNew, '{nationalitydesign}', '');
//                         dataNew = replaceData(dataNew, '{nationalitydesigntwo}', '');
//                         dataNew = replaceData(dataNew, '{nationalitydesignthree}', '');
//                     }
        
//                     // Marital Status
//                     if (content?.personaldetails?.maritalStatus) {
//                         dataNew = replaceData(dataNew, '{marital}', content.personaldetails.maritalStatus);
//                         dataNew = replaceData(dataNew, '{maritaldesigntwo}', `<li><div class="data">${content.personaldetails.maritalStatus}</div><div class="icon"><i class="fa fa-heart"></i></div></li>`);
//                         dataNew = replaceData(dataNew, '{maritaldesignthree}', `<li><div class="icon"><span class="data"><i class="fa fa-heart"></i>${content.personaldetails.maritalStatus}</span></div></li>`);
//                         dataNew = replaceData(dataNew, '{maritaldesignfour}', `<li><div class="icon"><i class="fa fa-heart"></i></div><div class="data">${content.personaldetails.maritalStatus}</div></li>`);
//                         dataNew = replaceData(dataNew, '{maritaldesignfive}', `<li class="exper_dot">${content.personaldetails.maritalStatus}</li>`);
//                         dataNew = replaceData(dataNew, '{maritaldesignsix}', `<li><div class="icon"><i class="fa fa-heart"></i><span class="data">${content.personaldetails.maritalStatus}</span></div></li>`);
//                         dataNew = replaceData(dataNew, '{maritaldesignseven}', `<li> Marital Status : ${content.personaldetails.maritalStatus} </li>`);
//                     } else {
//                         dataNew = replaceData(dataNew, '{marital}', '');
//                         dataNew = replaceData(dataNew, '{maritaldesigntwo}', '');
//                         dataNew = replaceData(dataNew, '{maritaldesignthree}', '');
//                         dataNew = replaceData(dataNew, '{maritaldesignfour}', '');
//                         dataNew = replaceData(dataNew, '{maritaldesignfive}', '');
//                         dataNew = replaceData(dataNew, '{maritaldesignsix}', '');
//                         dataNew = replaceData(dataNew, '{maritaldesignseven}', '');
//                     }
        
//                     // Father Name
//                     if (content?.personaldetails?.fatherName) {
//                         dataNew = replaceData(dataNew, '{ftName}', content.personaldetails.fatherName);
//                         dataNew = replaceData(dataNew, '{ftNamedesigntwo}', `<li><div class="data">${content.personaldetails.fatherName}</div><div class="icon"><i class="fas fa-child"></i></div></li>`);
//                         dataNew = replaceData(dataNew, '{ftNamedesignthree}', `<li><div class="icon"><span class="data"><i class="fas fa-child"></i>${content.personaldetails.fatherName}</span></div></li>`);
//                         dataNew = replaceData(dataNew, '{ftNamedesignfour}', `<li><div class="icon"><i class="fas fa-child"></i></div><div class="data">${content.personaldetails.fatherName}</div></li>`);
//                         dataNew = replaceData(dataNew, '{ftNamedesignfive}', `<li class="exper_dot">${content.personaldetails.fatherName}</li>`);
//                         dataNew = replaceData(dataNew, '{ftNamedesignsix}', `<li><div class="icon"><i class="fas fa-child"></i><span class="data">${content.personaldetails.fatherName}</span></div></li>`);
//                         dataNew = replaceData(dataNew, '{ftNamedesignseven}', `<li> Fathers Name : ${content.personaldetails.fatherName} </li>`);
//                     } else {
//                         dataNew = replaceData(dataNew, '{ftName}', '');
//                         dataNew = replaceData(dataNew, '{ftNamedesigntwo}', '');
//                         dataNew = replaceData(dataNew, '{ftNamedesignthree}', '');
//                         dataNew = replaceData(dataNew, '{ftNamedesignfour}', '');
//                         dataNew = replaceData(dataNew, '{ftNamedesignfive}', '');
//                         dataNew = replaceData(dataNew, '{ftNamedesignsix}', '');
//                         dataNew = replaceData(dataNew, '{ftNamedesignseven}', '');
//                     }
        
//                     // Image
//                     if (content?.personaldetails?.imageUrl) {
//                         dataNew = replaceData(dataNew, '{image}', content.personaldetails.imageUrl);
//                     } else if (content?.personaldetails?.gender === 'Male') {
//                         dataNew = replaceData(dataNew, '{image}', 'https://lookingforresume.com/images/male-img.png');
//                     } else if (content?.personaldetails?.gender === 'Female') {
//                         dataNew = replaceData(dataNew, '{image}', 'https://lookingforresume.com/images/female-img.png');
//                     } else {
//                         dataNew = replaceData(dataNew, '{image}', 'http://lookingforresume.com/images/noavatar.png');
//                     }
        
//                     // Website
//                     if (content?.personaldetails?.website) {
//                         dataNew = replaceData(dataNew, '{website}', content.personaldetails.website);
//                         dataNew = replaceData(dataNew, '{secoundwebsite}', `<li><div class="icon"><i class="fas fa-globe"></i></div><div class="data">${content.personaldetails.website}</div></li>`);
//                         dataNew = replaceData(dataNew, '{websitethree}', `<li><div class="data">${content.personaldetails.website}</div><div class="icon"><i class="fas fa-globe"></i></div></li>`);
//                         dataNew = replaceData(dataNew, '{websitefour}', `<li><div class="icon"><i class="fas fa-globe"></i><span class="data">${content.personaldetails.website}</span></div></li>`);
//                     } else {
//                         dataNew = replaceData(dataNew, '{website}', '');
//                         dataNew = replaceData(dataNew, '{secoundwebsite}', '');
//                         dataNew = replaceData(dataNew, '{websitethree}', '');
//                         dataNew = replaceData(dataNew, '{websitefour}', '');
//                     }
        
//                     // Name
//                     if (content?.personaldetails?.name) {
//                         dataNew = replaceData(dataNew, '{name}', content.personaldetails.name);
//                     } else {
//                         dataNew = replaceData(dataNew, '{name}', '');
//                     }
        
//                     // Internship Details
//                     if (content?.internshipDetails) {
//                         let newinternship = '<div class="resume-border-bottom resume_side_bar polaroid"><div class="resume_side_line"> <div class="resume_item resume_internship"><div class="title"><p class="bold resume_line resume_box">INTERNSHIPS</p></div>';
//                         let newinternshipone = '<div class="resume_side_bar polaroid"><div class="resume_side_line"> <div class="resume_item resume_internship"><div class="title"><div class="title-icon"> <i class="far fa-window-restore"></i></div><p class="bold resume_line resume_box">INTERNSHIPS</p></div>';
//                         let newinternshiptwo = '<div class="resume_item resume_internship"><div class="title"><p class="bold resume_line resume_box">INTERNSHIPS</p></div>';
        
//                         content.internshipDetails.forEach((internship: any) => {
//                             const internshipEndYear = internship.present === 'yes' ? 'Present' : internship.yearTo || '';
//                             const internshipDesc = internship.detail ? `<p>${internship.detail}</p>` : '';
//                             const internshipStartYear = internship.yearFrom ? ` ${internship.yearFrom} ` : '';
        
//                             newinternship += `<div class="resume-com-cont"><p class="sub_title">${internship.internshipName}</p><div class="resume_edu">${internship.companyName}</div><div class="resume_exp"> ${internshipStartYear} ${internshipEndYear} </div><span class="resume_location">${internship.location}</span>${internshipDesc}</div>`;
//                             newinternshipone += `<div class="resume-com-cont"><p class="sub_title">${internship.internshipName}</p><div class="resume_edu">${internship.companyName}</div><div class="resume_exp"> ${internshipStartYear} ${internshipEndYear} </div><span class="resume_location">${internship.location}</span>${internshipDesc}</div>`;
//                             newinternshiptwo += `<div class="resume-com-cont"><p class="sub_title">${internship.internshipName}</p><div class="resume_edu">${internship.companyName}</div><div class="resume_exp"> ${internshipStartYear} ${internshipEndYear} </div><span class="resume_location">${internship.location}</span>${internshipDesc}</div>`;
//                         });
        
//                         newinternship += '</div></div></div>';
//                         newinternshipone += '</div></div></div>';
//                         newinternshiptwo += '</div>';
        
//                         dataNew = replaceData(dataNew, '{internship}', newinternship);
//                         dataNew = replaceData(dataNew, '{internshipdesign}', newinternshipone);
//                         dataNew = replaceData(dataNew, '{internshipdesigntwo}', newinternshiptwo);
//                     } else {
//                         dataNew = replaceData(dataNew, '{internship}', '');
//                         dataNew = replaceData(dataNew, '{internshipdesign}', '');
//                         dataNew = replaceData(dataNew, '{internshipdesigntwo}', '');
//                     }
        
//                     // Process Education Details
//                     let neweducation = '';
//                     let neweducationone = '';
//                     let designeducation = '';
//                     let designeducationtwo = '';
        
//                     if (content?.educationDetails && content.educationDetails.length > 0) {
//                         neweducation = '<div class="resume-border-bottom resume_side_bar polaroid"><div class="resume_side_line"><div class="resume-items resume_experince"><div class="title"><p class="bold resume_space resume_line resume_box">EDUCATION</p></div>';
//                         neweducationone = '<div class="resume_side_bar polaroid"><div class="resume_side_line"><div class="resume-items resume_experince"><div class="title"><div class="title-icon"><i class="fas fa-graduation-cap"></i></div><p class="bold resume_space resume_line resume_box">EDUCATION</p></div>';
//                         designeducation = '<div class="resume_item resume_education"><div class="title"><p class="bold resume_box">EDUCATION</p></div>';
//                         designeducationtwo = '<div class="resume_item resume_education"><div class="title"><p class="bold resume_box">EDUCATION</p></div><div class="resume_infos">';
        
//                         content.educationDetails.forEach((education: any) => {
//                             if (education.present === 'yes') {
//                                 education.yearTo = 'Present';
//                             }
        
//                             const educationdesc = education.detail ? `<p>${education.detail}</p>` : '';
//                             const educationGrade = education.grade ? `<div class="edu-grade">Grade - ${education.grade}</div>` : '';
//                             const educationGradeone = education.grade ? `<p class="edu-grade">Grade - ${education.grade}</p>` : '';
//                             const educationstartyear = education.yearFrom || '';
//                             const educationendyear = education.yearTo ? ` - ${education.yearTo}` : '';
        
//                             neweducation += `
//                     <div class="resume-com-cont">
//                         <p class="sub_title">${education.eduName}</p>
//                         <span class="resume_exp">${education.degreeName}</span>
//                         <span class="education-year">${educationstartyear} ${educationendyear}</span>
//                         <div class="edu-grade">${educationGrade}</div>
//                         <span class="resume_location">${education.location}</span>
//                         ${educationdesc}
//                     </div>`;
        
//                             neweducationone += `
//                     <div class="resume-com-cont">
//                         <p class="sub_title">${education.eduName}</p>
//                         <span class="resume_exp">${education.degreeName}</span>
//                         <span class="education-year">${educationstartyear} ${educationendyear}</span>
//                         <div class="edu-grade">${educationGrade}</div>
//                         <span class="resume_location">${education.location}</span>
//                         ${educationdesc}
//                     </div>`;
        
//                             designeducation += `
//                     <div class="education-block">
//                         <h4>${education.degreeName}</h4>
//                         <p>${education.eduName}</p>
//                         <p>${educationstartyear} ${educationendyear}</p>
//                         ${educationGradeone}
//                         <span class="resume_location">${education.location}</span>
//                     </div>`;
        
//                             designeducationtwo += `
//                     <div class="resume_data">
//                         ${educationstartyear || educationendyear ? `<div class="year">${educationstartyear} ${educationendyear}</div>` : ''}
//                         <div class="content">
//                             <span class="resume_exp">${education.degreeName}</span>
//                             <div class="resume_edu">${education.eduName}</div>
//                             <spna class="education-year edu-grade">${education.grade}</spna>
//                             <span class="resume_location">${education.location}</span>
//                             ${educationdesc}
//                         </div>
//                     </div>`;
//                         });
        
//                         neweducation += '</div></div></div>';
//                         neweducationone += '</div></div></div>';
//                         designeducation += '</div>';
//                         designeducationtwo += '</div></div>';
        
//                         dataNew = replaceData(dataNew, '{education}', neweducation);
//                         dataNew = replaceData(dataNew, '{neweducationone}', neweducationone);
//                         dataNew = replaceData(dataNew, '{designeducation}', designeducation);
//                         dataNew = replaceData(dataNew, '{designeducationtwo}', designeducationtwo);
//                     } else {
//                         dataNew = replaceData(dataNew, '{education}', '');
//                         dataNew = replaceData(dataNew, '{neweducationone}', '');
//                         dataNew = replaceData(dataNew, '{designeducation}', '');
//                         dataNew = replaceData(dataNew, '{designeducationtwo}', '');
//                     }
        
//                     // Process Experience Details
//                     let newexperience = '';
//                     let newexperienceone = '';
//                     let newexperiencetwo = '';
        
//                     if (content?.experienceDetails && content.experienceDetails.length > 0) {
//                         newexperience = '<div class="resume-border-bottom resume_side_bar polaroid"><div class="resume_side_line"><div class="resume_experince"><div class="title"><p class="bold resume_space resume_line resume_box">PROFESSIONAL EXPERIENCE</p></div>';
//                         newexperienceone = '<div class="resume_side_bar polaroid"><div class="resume_side_line"><div class="resume_item resume_experince"><div class="title"><div class="title-icon"><i class="fas fa-briefcase"></i></div><p class="bold resume_space resume_line resume_box">EXPERIENCE</p></div>';
//                         newexperiencetwo = '<div class="resume_item resume_experience"><div class="title"><p class="bold resume_box">EXPERIENCE</p></div><div class="resume_infos">';
        
//                         content.experienceDetails.forEach((experience: any) => {
//                             if (experience.present === 'yes') {
//                                 experience.yearTo = 'Present';
//                             }
        
//                             const experiencedesc = experience.detail ? `<p>${experience.detail}</p>` : '';
//                             const experiencedescone = experience.detail ? `<p class="res_para">${experience.detail}</p>` : '';
//                             const experiencestartyear = experience.yearFrom || '';
//                             const experienceendyear = experience.yearTo ? ` - ${experience.yearTo}` : '';
        
//                             newexperience += `
//                     <div class="resume-com-cont">
//                         <p class="sub_title">${experience.jobPosition}</p>
//                         <div class="resume_edu">${experience.companyName}</div>
//                         <span class="resume_exp">${experiencestartyear} ${experienceendyear}</span>
//                         <span class="resume_location">${experience.location}</span>
//                         ${experiencedesc}
//                     </div>`;
        
//                             newexperienceone += `
//                     <div class="resume-com-cont">
//                         <p class="sub_title">${experience.jobPosition}</p>
//                         <div class="resume_edu">${experience.companyName}</div>
//                         <span class="resume_exp">${experiencestartyear} ${experienceendyear}</span>
//                         <span class="resume_location">${experience.location}</span>
//                         ${experiencedesc}
//                     </div>`;
        
//                             newexperiencetwo += `
//                     <div class="resume_data">
//                         ${experiencestartyear || experienceendyear ? `<div class="year">${experiencestartyear} ${experienceendyear}</div>` : ''}
//                         <div class="content">
//                             <span class="resume_exp">${experience.jobPosition}</span>
//                             <div class="resume_edu">${experience.companyName}</div>
//                             <span class="resume_location">${experience.location}</span>
//                             ${experiencedescone}
//                         </div>
//                     </div>`;
//                         });
        
//                         newexperience += '</div></div></div>';
//                         newexperienceone += '</div></div></div>';
//                         newexperiencetwo += '</div></div>';
        
//                         dataNew = replaceData(dataNew, '{expericence}', newexperience);
//                         dataNew = replaceData(dataNew, '{newexpericenceone}', newexperienceone);
//                         dataNew = replaceData(dataNew, '{newexpericencetwo}', newexperiencetwo);
//                     } else {
//                         dataNew = replaceData(dataNew, '{expericence}', '');
//                         dataNew = replaceData(dataNew, '{newexpericenceone}', '');
//                         dataNew = replaceData(dataNew, '{newexpericencetwo}', '');
//                     }
        
//                     // Process Project Details
//                     let newProject = '';
//                     let newProjectone = '';
//                     let newProjectTwo = '';
        
//                     if (content?.projectDetails && content.projectDetails.length > 0) {
//                         newProject = '<div class="resume-border-bottom resume_side_bar polaroid"><div class="resume_side_line"><div class="resume_item resume_experince"><div class="title"><p class="bold resume_line resume_box">Projects</p></div>';
//                         newProjectone = '<div class="resume_side_bar polaroid"><div class="resume_side_line"><div class="resume_item resume_experince"><div class="title"><div class="title-icon"><i class="fas fa-project-diagram"></i></div><p class="bold resume_line resume_box">Projects</p></div>';
//                         newProjectTwo = '<div class="resume_item resume_service"><div class="title"><p class="bold resume_box">Projects</p></div><div class="resume_infos">';
        
//                         content.projectDetails.forEach((project: any) => {
//                             const projectStartDate = project.projectStartDate ? `<span class="project_se_date">StartDate: </span>${project.projectStartDate} ` : '';
//                             const projectEndDate = project.projectEndDate ? `<span class="project_se_date" style="padding-left:3px;">EndDate: </span>${project.projectEndDate} ` : '';
        
//                             newProject += `
//                     <div class="resume-com-cont">
//                         <p class="sub_title">${project.projectTitle}</p>
//                         <div class="resume_edu">${project.companyname}</div>
//                         <span class="resume_exp">${project.role}</span>
//                         <div class="project_date">${projectStartDate}${projectEndDate}</div>
//                         <p>${project.projectDescription}</p>
//                     </div>`;
        
//                             newProjectone += `
//                     <div class="resume-com-cont">
//                         <p class="sub_title">${project.projectTitle}</p>
//                         <div class="resume_edu">${project.companyname}</div>
//                         <span class="resume_exp">${project.role}</span>
//                         <div class="project_date">${projectStartDate}${projectEndDate}</div>
//                         <p>${project.projectDescription}</p>
//                     </div>`;
        
//                             newProjectTwo += `
//                     <div class="resume_data">
//                         ${projectStartDate || projectEndDate ? `<div class="year">${projectStartDate}${projectEndDate}</div>` : ''}
//                         <div class="content">
//                             <p class="sub_title">${project.projectTitle}</p>
//                             <div class="resume_edu">${project.companyname}</div>
//                             <span class="resume_expe">${project.role}</span>
//                             <p class="resume_color">${project.projectDescription}</p>
//                         </div>
//                     </div>`;
//                         });
        
//                         newProject += '</div></div></div>';
//                         newProjectone += '</div></div></div>';
//                         newProjectTwo += '</div></div>';
        
//                         dataNew = replaceData(dataNew, '{project}', newProject);
//                         dataNew = replaceData(dataNew, '{newProjectone}', newProjectone);
//                         dataNew = replaceData(dataNew, '{newProjectTwo}', newProjectTwo);
//                     } else {
//                         dataNew = replaceData(dataNew, '{project}', '');
//                         dataNew = replaceData(dataNew, '{newProjectone}', '');
//                         dataNew = replaceData(dataNew, '{newProjectTwo}', '');
//                     }
        
//                     // Process Reference Details
//                     let newRefrence = '';
//                     let designRefrence = '';
//                     let designRefrenceone = '';
        
//                     if (content?.referenceDetails && content.referenceDetails.length > 0) {
//                         newRefrence = '<div class="resume_item resume_reference"><div class="title"><p class="bold resume_line">REFERENCES</p></div>';
//                         designRefrence = '<div class="resume-border-bottom resume_side_bar polaroid"><div class="resume_side_line"><div class="resume_item resume_references"><div class="title"><p class="bold resume_space resume_box resume_line">REFERENCES</p></div><ul class="class">';
//                         designRefrenceone = '<div class="resume_side_bar polaroid"><div class="resume_side_line"><div class="resume_item resume_references"><div class="title"><div class="title-icon"><i class="fas fa-asterisk"></i></div><p class="bold resume_space resume_box resume_line">REFERENCES</p></div><ul class="class">';
        
//                         content.referenceDetails.forEach((reference: any) => {
//                             newRefrence += `
//                     <h4>${reference.refName}</h4>
//                     <p class="refer_detail">${reference.refJobTitle}</p>
//                     <p class="refer_detail">${reference.refCompanyName}</p>
//                     <p class="refer_detail">${reference.refWebsite}</p>
//                     <p class="refer_detail">${reference.refPhone}</p>
//                     <p class="refer_detail">${reference.refEmail}</p>`;
        
//                             designRefrence += `
//                     <li>
//                         <p class="sub_title">${reference.refName}</p>
//                         <p class="refer_detail">${reference.refJobTitle}</p>
//                         <p class="refer_detail">${reference.refCompanyName}</p>
//                         <p class="refer_detail">${reference.refWebsite}</p>
//                         <p class="refer_detail">${reference.refPhone}</p>
//                         <p class="refer_detail">${reference.refEmail}</p>
//                     </li>`;
        
//                             designRefrenceone += `
//                     <li>
//                         <p class="sub_title">${reference.refName}</p>
//                         <p class="refer_detail">${reference.refJobTitle}</p>
//                         <p class="refer_detail">${reference.refCompanyName}</p>
//                         <p class="refer_detail">${reference.refWebsite}</p>
//                         <p class="refer_detail">${reference.refPhone}</p>
//                         <p class="refer_detail">${reference.refEmail}</p>
//                     </li>`;
//                         });
        
//                         newRefrence += '</div>';
//                         dataNew = replaceData(dataNew, '{References}', newRefrence);
        
//                         designRefrence += '</ul></div></div></div>';
//                         dataNew = replaceData(dataNew, '{designRefrence}', designRefrence);
        
//                         designRefrenceone += '</ul></div></div></div>';
//                         dataNew = replaceData(dataNew, '{designRefrenceone}', designRefrenceone);
//                     } else {
//                         dataNew = replaceData(dataNew, '{References}', '');
//                         dataNew = replaceData(dataNew, '{designRefrence}', '');
//                         dataNew = replaceData(dataNew, '{designRefrenceone}', '');
//                     }
        
//                     // Process Achievement Details
//                     let newAwards = '';
//                     let newAwardsone = '';
//                     let awardDesign = '';
        
//                     if (content?.achievementDetails && content.achievementDetails.length > 0) {
//                         newAwards = `
//                 <div class="resume-border-bottom resume_item resume_award">
//                     <div class="title">
//                         <p class="bold resume_line resume_box resume_color">AWARDS</p>
//                     </div>`;
//                         newAwardsone = `
//                 <div class="resume_item resume_award">
//                     <div class="title">
//                         <div class="title-icon"><i class="fas fa-trophy"></i></div>
//                         <p class="bold resume_line resume_box resume_color">AWARDS</p>
//                     </div>`;
//                         awardDesign = `
//                 <div class="resume_item resume_references resume_award">
//                     <div class="title">
//                         <p class="bold resume_space resume_box resume_color resume_line">AWARDS</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul class="class">`;
        
//                         content.achievementDetails.forEach((achievement: any) => {
//                             newAwards += `
//                     <h4 class="sub-bold">AWARD RECEIVED</h4>
//                     <p class="awards_detail">${achievement.achivementName}<br>${achievement.year}</p>`;
//                             newAwardsone += `
//                     <h4 class="sub-bold">AWARD RECEIVED</h4>
//                     <p class="awards_detail">${achievement.achivementName}<br>${achievement.year}</p>`;
//                             awardDesign += `
//                     <li>
//                         <p class="sub_title">AWARD RECEIVED</p>
//                         <p class="refer_detail">${achievement.achivementName}<br>${achievement.year}</p>
//                     </li>`;
//                         });
        
//                         awardDesign += '</ul></div></div>';
//                         newAwards += '</div>';
//                         newAwardsone += '</div>';
        
//                         dataNew = replaceData(dataNew, '{Awards}', newAwards);
//                         dataNew = replaceData(dataNew, '{newAwardsone}', newAwardsone);
//                         dataNew = replaceData(dataNew, '{awardDesign}', awardDesign);
//                     } else {
//                         dataNew = replaceData(dataNew, '{Awards}', '');
//                         dataNew = replaceData(dataNew, '{newAwardsone}', '');
//                         dataNew = replaceData(dataNew, '{awardDesign}', '');
//                     }
        
//                     // Process Activities
//                     let newactivitie = '';
//                     let newactivitieone = '';
        
//                     if (content?.activities && content.activities.length > 0) {
//                         newactivitie = `
//                 <div class="resume-border-bottom resume_item resume_activities">
//                     <div class="title">
//                         <p class="bold resume_line resume_box resume_color">ACTIVITIES</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul class="comma-list">`;
//                         newactivitieone = `
//                 <div class="resume_item resume_activities">
//                     <div class="title">
//                         <div class="title-icon"><i class="fas fa-palette"></i></div>
//                         <p class="bold resume_line resume_box resume_color">ACTIVITIES</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
        
//                         content.activities.forEach((activity: any) => {
//                             newactivitie += `<li>${activity}</li>`;
//                             newactivitieone += `<li>${activity}</li>`;
//                         });
        
//                         newactivitie += '</ul></div></div>';
//                         newactivitieone += '</ul></div></div>';
        
//                         dataNew = replaceData(dataNew, '{activitie}', newactivitie);
//                         dataNew = replaceData(dataNew, '{newactivitieone}', newactivitieone);
//                     } else {
//                         dataNew = replaceData(dataNew, '{activitie}', '');
//                         dataNew = replaceData(dataNew, '{newactivitieone}', '');
//                     }
        
//                     // Process Interests
//                     let newinterest = '';
//                     let newinterestone = '';
        
//                     if (content?.interest && content.interest.length > 0) {
//                         newinterest = `
//                 <div class="resume-border-bottom resume_item resume_interest">
//                     <div class="title">
//                         <p class="bold resume_line resume_box resume_color">INTERESTS</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul class="comma-list">`;
//                         newinterestone = `
//                 <div class="resume_item resume_interest">
//                     <div class="title">
//                         <div class="title-icon"><i class="fas fa-star"></i></div>
//                         <p class="bold resume_line resume_box resume_color">INTERESTS</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
        
//                         content.interest.forEach((interest: any) => {
//                             newinterest += `<li>${interest}</li>`;
//                             newinterestone += `<li>${interest}</li>`;
//                         });
        
//                         newinterest += '</ul></div></div>';
//                         newinterestone += '</ul></div></div>';
        
//                         dataNew = replaceData(dataNew, '{interest}', newinterest);
//                         dataNew = replaceData(dataNew, '{newinterestone}', newinterestone);
//                     } else {
//                         dataNew = replaceData(dataNew, '{interest}', '');
//                         dataNew = replaceData(dataNew, '{newinterestone}', '');
//                     }
        
//                     // Process Strengths
//                     let newstrength = '';
//                     let newstrengthone = '';
        
//                     if (content?.strength && content.strength.length > 0) {
//                         newstrength = `
//                 <div class="resume-border-bottom resume_item resume_strength">
//                     <div class="title">
//                         <p class="bold resume_line resume_box resume_color">STRENGTHS</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul class="comma-list">`;
//                         newstrengthone = `
//                 <div class="resume_item resume_strength">
//                     <div class="title">
//                         <div class="title-icon"><i class="fas fa-dumbbell"></i></div>
//                         <p class="bold resume_line resume_box resume_color">STRENGTHS</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
        
//                         content.strength.forEach((strength: any) => {
//                             newstrength += `<li>${strength}</li>`;
//                             newstrengthone += `<li>${strength}</li>`;
//                         });
        
//                         newstrength += '</ul></div></div>';
//                         newstrengthone += '</ul></div></div>';
        
//                         dataNew = replaceData(dataNew, '{strength}', newstrength);
//                         dataNew = replaceData(dataNew, '{newstrengthone}', newstrengthone);
//                     } else {
//                         dataNew = replaceData(dataNew, '{strength}', '');
//                         dataNew = replaceData(dataNew, '{newstrengthone}', '');
//                     }
        
//                     // Process Language Details
//                     let newLanguage = '';
//                     let newLanguageone = '';
//                     let newLanguagetwo = '';
//                     let newLanguagethree = '';
        
//                     if (content?.languageDetails && content.languageDetails.length > 0) {
//                         newLanguage = `
//                 <div class="rb-block">
//                     <p class="head">
//                         <i class="fa fa-language" aria-hidden="true"></i>
//                         <span>language</span>
//                     </p>
//                     <div>
//                         <div class="rb-box-content">`;
//                         newLanguageone = `
//                 <div class="resume_item resume_skills">
//                     <div class="title">
//                         <div class="title-icon"><i class="fas fa-brain"></i></div>
//                         <p class="bold resume_line resume_box resume_color">Languages</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
//                         newLanguagetwo = `
//                 <div class="resume-border-bottom resume_item resume_skills">
//                     <div class="title">
//                         <p class="bold resume_line resume_box resume_color">Languages</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
//                         newLanguagethree = `
//                 <div class="resume_item resume_language">
//                     <div class="title">
//                         <p class="bold resume_line resume_box">Languages</p>
//                     </div>
//                     <div class="resume_lang">
//                         <ul class="comma-list">`;
        
//                         content.languageDetails.forEach((language: any) => {
//                             newLanguage += `<h3><span>${language.langName}</span></h3>`;
//                             newLanguageone += `
//                     <li>
//                         <div class="skill_name">${language.langName}</div>
//                         <div class="skill_progress">
//                             <span class="rb-skillrate-value" value="${parseInt(language.langScore, 10)}"></span>
//                         </div>
//                     </li>`;
//                             newLanguagetwo += `
//                     <li>
//                         <div class="skill_name">${language.langName}</div>
//                         <div class="skill_progress">
//                             <span class="rb-skillrate-value" value="${parseInt(language.langScore, 10)}"></span>
//                         </div>
//                     </li>`;
//                             newLanguagethree += `<li>${language.langName}</li>`;
//                         });
        
//                         newLanguage += '</div></div>';
//                         newLanguageone += '</ul></div></div>';
//                         newLanguagetwo += '</ul></div></div>';
//                         newLanguagethree += '</ul></div></div>';
        
//                         dataNew = replaceData(dataNew, '{language}', newLanguage);
//                         dataNew = replaceData(dataNew, '{newLanguageone}', newLanguageone);
//                         dataNew = replaceData(dataNew, '{newLanguagetwo}', newLanguagetwo);
//                         dataNew = replaceData(dataNew, '{newLanguagethree}', newLanguagethree);
//                     } else {
//                         dataNew = replaceData(dataNew, '{language}', '');
//                         dataNew = replaceData(dataNew, '{newLanguageone}', '');
//                         dataNew = replaceData(dataNew, '{newLanguagetwo}', '');
//                         dataNew = replaceData(dataNew, '{newLanguagethree}', '');
//                     }
        
//                     // Process Skills
//                     let newSkill = '';
//                     let newSkillList = '';
//                     let newSkillListone = '';
//                     let newSkillListTwo = '';
        
//                     if (content?.skill && content.skill.length > 0) {
//                         newSkill = `
//                 <div class="resume_item resume_skills">
//                     <div class="title">
//                         <p class="bold lang resume_color resume_line">Skills</p>
//                     </div>
//                     <ul>`;
//                         newSkillList = `
//                 <div class="resume-border-bottom resume_item resume_skills">
//                     <div class="title">
//                         <p class="bold resume_line resume_box resume_color">Skills</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
//                         newSkillListone = `
//                 <div class="resume_item resume_skills">
//                     <div class="title">
//                         <div class="title-icon"><i class="fas fa-user-edit"></i></div>
//                         <p class="bold resume_line resume_box resume_color">Skills</p>
//                     </div>
//                     <div class="resume_left_pd">
//                         <ul>`;
//                         newSkillListTwo = `
//                 <div class="resume_item resume_skills">
//                     <div class="title">
//                         <p class="bold resume_line resume_box">SKILLS</p>
//                     </div>
//                     <div class="resume_skil">
//                         <ul class="comma-list">`;
        
//                         content.skill.forEach((skill: any) => {
//                             newSkill += `<li><div class="skill_name">${skill.skillName}</div></li>`;
//                             newSkillList += `
//                     <li>
//                         <div class="skill_name">${skill.skillName}</div>
//                         <div class="skill_progress">
//                             <span class="rb-skillrate-value" value="${parseInt(skill.skillScore, 10)}"></span>
//                         </div>
//                     </li>`;
//                             newSkillListone += `
//                     <li>
//                         <div class="skill_name">${skill.skillName}</div>
//                         <div class="skill_progress">
//                             <span class="rb-skillrate-value" value="${parseInt(skill.skillScore, 10)}"></span>
//                         </div>
//                     </li>`;
//                             newSkillListTwo += `<li>${skill.skillName}</li>`;
//                         });
        
//                         newSkill += '</ul></div>';
//                         newSkillList += '</ul></div></div>';
//                         newSkillListone += '</ul></div></div>';
//                         newSkillListTwo += '</ul></div></div>';
        
//                         dataNew = replaceData(dataNew, '{skill}', newSkill);
//                         dataNew = replaceData(dataNew, '{skillList}', newSkillList);
//                         dataNew = replaceData(dataNew, '{skillListone}', newSkillListone);
//                         dataNew = replaceData(dataNew, '{newSkillListTwo}', newSkillListTwo);
//                     } else {
//                         dataNew = replaceData(dataNew, '{skill}', '');
//                         dataNew = replaceData(dataNew, '{skillList}', '');
//                         dataNew = replaceData(dataNew, '{skillListone}', '');
//                         dataNew = replaceData(dataNew, '{newSkillListTwo}', '');
//                     }
        
//                     // Process About Me and Objective
//                     if (content?.personaldetails?.aboutUs || content.objective) {
//                         const aboutData = content?.personaldetails?.aboutUs;
//                         const objectData = content.objective;
        
//                         if (aboutData) {
//                             dataNew = replaceData(dataNew, '{aboutusObjective}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <p class="res-about experi-pd">${aboutData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{objective}', aboutData);
//                             dataNew = replaceData(dataNew, '{profileObjective}', `
//                     <div class="resume_profile_title">
//                         <h2>PROFILE</h2>
//                         <p>${aboutData}</p>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutObjective}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${aboutData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutObjectiveone}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <div class="title-icon"><i class="fas fa-user"></i></div>
//                                     <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${aboutData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                         } else if (objectData) {
//                             dataNew = replaceData(dataNew, '{objective}', objectData);
//                             dataNew = replaceData(dataNew, '{profileObjective}', `
//                     <div class="resume_profile_title">
//                         <h2>PROFILE</h2>
//                         <p>${objectData}</p>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutusObjective}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <p class="res-about experi-pd">${objectData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutObjective}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${objectData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutObjectiveone}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <div class="title-icon"><i class="fas fa-user"></i></div>
//                                     <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${objectData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                         }
        
//                         // Additional logic if both About Me and Objective are present
//                         if (aboutData && objectData) {
//                             dataNew = replaceData(dataNew, '{aboutObjective}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${aboutData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{objectivedata}', `
//                     <div class="resume_side_bar polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <p class="bold resume_box resume_line">Objective</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${objectData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{objectivedatas}', `
//                     <div class="resume_side_bar polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_objective">
//                                 <div class="title">
//                                     <p class="bold resume_box resume_line">Objective</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${objectData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutObjectivetwo}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <div class="title-icon"><i class="fas fa-bullseye"></i></div>
//                                     <p class="bold resume_box resume_line">Objective</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${objectData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                             dataNew = replaceData(dataNew, '{aboutObjectiveone}', `
//                     <div class="polaroid">
//                         <div class="resume_side_line">
//                             <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                     <div class="title-icon"><i class="fas fa-user"></i></div>
//                                     <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${aboutData}</p>
//                             </div>
//                         </div>
//                     </div>`);
//                         }
//                     } else {
//                         dataNew = replaceData(dataNew, '{objective}', '');
//                         dataNew = replaceData(dataNew, '{profileObjective}', '');
//                         dataNew = replaceData(dataNew, '{aboutObjective}', '');
//                         dataNew = replaceData(dataNew, '{aboutObjectiveone}', '');
//                         dataNew = replaceData(dataNew, '{aboutObjectivetwo}', '');
//                         dataNew = replaceData(dataNew, '{objectivedata}', '');
//                         dataNew = replaceData(dataNew, '{objectivedatas}', '');
//                     }
        
//                     if (content?.personaldetails?.aboutUs && content.objective) {
//                         // Replace placeholders with the content
//                         dataNew = dataNew.replace('{aboutObjective}', `
//                           <div class="polaroid">
//                             <div class="resume_side_line">
//                               <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                   <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${content.personaldetails.aboutUs}</p>
//                               </div>
//                             </div>
//                           </div>
//                         `);
        
//                         dataNew = dataNew.replace('{objectivedata}', `
//                           <div class="resume_side_bar polaroid">
//                             <div class="resume_side_line">
//                               <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                   <p class="bold resume_box resume_line">Objective</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${content.objective}</p>
//                               </div>
//                             </div>
//                           </div>
//                         `);
        
//                         dataNew = dataNew.replace('{objectivedatas}', `
//                           <div class="resume_side_bar polaroid">
//                             <div class="resume_side_line">
//                               <div class="about-sec resume_items resume_item resume_profile resume_objective">
//                                 <div class="title">
//                                   <p class="bold resume_box resume_line">Objective</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${content.objective}</p>
//                               </div>
//                             </div>
//                           </div>
//                         `);
        
//                         dataNew = dataNew.replace('{aboutObjectivetwo}', `
//                           <div class="polaroid">
//                             <div class="resume_side_line">
//                               <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                   <div class="title-icon"><i class="fas fa-bullseye"></i></div>
//                                   <p class="bold resume_box resume_line">Objective</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${content.objective}</p>
//                               </div>
//                             </div>
//                           </div>
//                         `);
        
//                         dataNew = dataNew.replace('{aboutObjectiveone}', `
//                           <div class="polaroid">
//                             <div class="resume_side_line">
//                               <div class="about-sec resume_items resume_item resume_profile resume_about">
//                                 <div class="title">
//                                   <div class="title-icon"><i class="fas fa-user"></i></div>
//                                   <p class="bold resume_box resume_line">About ME</p>
//                                 </div>
//                                 <p class="res-about experi-pd">${content.personaldetails.aboutUs}</p>
//                               </div>
//                             </div>
//                           </div>
//                         `);
//                     } else {
//                         // Replace placeholders with empty strings if conditions are not met
//                         const placeholders = [
//                             '{objective}', '{profileObjective}', '{aboutObjective}',
//                             '{aboutObjectiveone}', '{aboutObjectivetwo}',
//                             '{objectivedata}', '{objectivedatas}'
//                         ];
        
//                         placeholders.forEach(placeholder => {
//                             dataNew = dataNew.replace(placeholder, '');
//                         });
//                     }
        
//                     if (content?.certificateDetails) {
//                         let newCertificate = '<div class="resume-border-bottom resume_side_bar polaroid"> <div class="resume_side_line"><div class="resume_item resume_certification">' +
//                             '<div class="title">' +
//                             '<p class="bold resume_line resume_box">CERTIFICATES</p>' +
//                             '</div>';
        
//                         let newCertificateone = '<div class="resume_side_bar polaroid"> <div class="resume_side_line"><div class="resume_item resume_certification">' +
//                             '<div class="title">' +
//                             '<div class="title-icon"> <i class="fas fa-certificate"></i></div>' +
//                             '<p class="bold resume_line resume_box">CERTIFICATES</p>' +
//                             '</div>';
        
//                         let newCertificatetwo = '<div class="resume_item resume_certification">' +
//                             '<div class="title">' +
//                             '<p class="bold resume_line resume_box">CERTIFICATES</p>' +
//                             '</div>';
        
//                         content.certificateDetails.forEach((certificate: any) => {
//                             let certificatedesc = certificate.detail ? `<p class="cer_detail">${certificate.detail}</p>` : '';
//                             let certificatestartyear = certificate.startDate ? ` ${certificate.startDate} ` : '';
//                             let certificateendyear = certificate.endDate ? ` - ${certificate.endDate} ` : '';
        
//                             if (certificate.present === 'yes') {
//                                 certificate.endDate = 'Present';
//                             }
        
//                             newCertificate += `<div class="resume-com-cont">
//                             <p class="sub_title">${certificate.courseName}</p>
//                             <div class="resume_edu">${certificate.organisation}</div>
//                             <span class="cer_id">${certificate.certificateId}</span>
//                             <span class="resume_exp">${certificatestartyear}${certificateendyear}</span>
//                             ${certificatedesc}
//                           </div>`;
        
//                             newCertificateone += `<div class="resume-com-cont">
//                             <p class="sub_title">${certificate.courseName}</p>
//                             <div class="resume_edu">${certificate.organisation}</div>
//                             <span class="cer_id">${certificate.certificateId}</span>
//                             <span class="resume_exp">${certificatestartyear}${certificateendyear}</span>
//                             ${certificatedesc}
//                           </div>`;
        
//                             newCertificatetwo += `<div class="resume_data">
//                             ${certificatestartyear || certificateendyear ? `<div class="year">${certificatestartyear}${certificateendyear}</div>` : ''}
//                             <div class="content">
//                               <span class="resume_exp">${certificate.courseName}</span>
//                               <div class="resume_edu">${certificate.organisation}</div>
//                               <span class="resume_location">${certificate.certificateId}</span>
//                               <p class="res_para">${certificate.detail}</p>
//                             </div>
//                           </div>`;
//                         });
        
//                         newCertificate += '</div></div></div>';
//                         newCertificateone += '</div></div></div>';
//                         newCertificatetwo += '</div>';
        
//                         dataNew = dataNew.replace('{Certificate}', newCertificate)
//                             .replace('{newCertificateone}', newCertificateone)
//                             .replace('{newCertificatetwo}', newCertificatetwo);
//                     } else {
//                         const placeholders = [
//                             '{Certificate}', '{newCertificateone}', '{newCertificatetwo}'
//                         ];
//                         placeholders.forEach(placeholder => {
//                             dataNew = dataNew.replace(placeholder, '');
//                         });
//                     }
        
//                     if (content?.socialLinks) {
//                         const socialLinks = {
//                           facebook: { icon: 'fab fa-facebook-f', url: content?.socialLinks?.facebook?.url },
//                           twitter: { icon: 'fab fa-twitter', url: content?.socialLinks?.twitter?.url },
//                           youtube: { icon: 'fab fa-youtube', url: content?.socialLinks?.youtube?.url },
//                           linkedin: { icon: 'fab fa-linkedin-in', url: content?.socialLinks?.linkedin?.url },
//                           skype: { icon: 'fab fa-skype', url: content?.socialLinks?.skype?.url },
//                           github: { icon: 'fab fa-github', url: content?.socialLinks?.github?.url },
//                           lfj: { icon: 'fas fa-briefcase', url: content?.socialLinks?.lfj?.url },
//                           instagram: { icon: 'fab fa-instagram', url: content?.socialLinks?.instagram?.url }
//                         };
                      
                       
                      
//                         let hasSocialLinks = false;
                      
//                         // Loop through each social link to replace or clear placeholders
//                         for (const [key, { icon, url }] of Object.entries(socialLinks)) {
//                           if (url) {
//                             hasSocialLinks = true;
//                             // Replace placeholders with the actual content
//                             dataNew = dataNew.replace(`{${key}}`, `<li><div class="icon"><i class="${icon}"></i></div><div class="data">${url}</div></li>`);
//                             dataNew = dataNew.replace(`{${key}design}`, `<li><div class="data">${url}</div><div class="icon"><i class="${icon}"></i></div></li>`);
//                             dataNew = dataNew.replace(`{${key}one}`, `<li><div class="icon"><i class="${icon}"></i><span class="data">${url}</span></div></li>`);
//                           } else {
//                             // Clear the placeholders if the URL is not present
//                             dataNew = dataNew.replace(`{${key}}`, "");
//                             dataNew = dataNew.replace(`{${key}design}`, "");
//                             dataNew = dataNew.replace(`{${key}one}`, "");
//                           }
//                         }
                      
//                         // Add title if there are social links
//                         if (hasSocialLinks) {
//                           dataNew = dataNew.replace('{socialtitle}', `
//                             <div class="title">
//                               <p class="bold lang resume_color resume_line resume_box">Social Links</p>
//                             </div>`);
//                           dataNew = dataNew.replace('{socialtitles}', `
//                             <div class="title">
//                               <div class="title-icon"><i class="fas fa-link"></i></div>
//                               <p class="bold lang resume_color resume_line resume_box">Social Links</p>
//                             </div>`);
//                         } else {
                         
//                           dataNew = dataNew.replace('{socialtitle}', '');
//                           dataNew = dataNew.replace('{socialtitles}', '');
//                         }
//                       } else {
//                         // Clear all social link placeholders if there are no social links
//                         const placeholders = [
//                           '{facebook}', '{twitter}', '{youtube}', '{linkedin}', '{skype}', '{github}', '{lfj}', '{instagram}',
//                           '{facebookdesign}', '{twitterdesign}', '{youtubedesign}', '{linkedindesign}', '{skypedesign}', '{githubdesign}', '{lfjdesign}', '{instagramdesign}',
//                           '{facebookone}', '{twitterone}', '{youtubeone}', '{linkedinone}', '{skypeone}', '{githubone}', '{lfjone}', '{instagramone}',
//                           '{socialtitle}', '{socialtitles}'
//                         ];
//                         placeholders.forEach(placeholder => {
//                           dataNew = dataNew.replace(placeholder, '');
//                         });
//                       }
                      
        
//                     let newDeclaration = '';
        
//                     if (content?.declaration) {
//                         let declarationPlace = '';
//                         let declarationDate = '';
//                         let declarationSignature = '';
        
//                         if (content?.declaration.place) {
//                             declarationPlace = `<h5 class="place">Place : ${content.declaration.place}</h5>`;
//                         }
//                         if (content?.declaration.date) {
//                             declarationDate = `<span class="Date">Date : ${content.declaration.date}</span>`;
//                         }
//                         if (content?.signature) {
//                             declarationSignature = `<img class="signature" src="${content.signature}" />`;
//                         }
        
//                         newDeclaration = `<div class="polaroid">
//                                           <div class="resume_item resume_declaration">
//                                             <div class="title">
//                                               <p class="bold dec-box">Declaration</p>
//                                             </div>
//                                             <div>
//                                               <p>${content.declaration.declaration}</p>
//                                               <div class="dec-space">
//                                                 <div class="res-dec-left">
//                                                   ${declarationPlace}
//                                                   ${declarationDate}
//                                                 </div>
//                                                 <div class="res-dec-right">
//                                                   ${declarationSignature}
//                                                   <h3 class="dec-name">${content.declaration.name}</h3>
//                                                 </div>
//                                               </div>
//                                             </div>
//                                           </div>
//                                         </div>`;
        
//                         dataNew = dataNew.replace('{newDeclaration}', newDeclaration);
//                     } else {
//                         dataNew = dataNew.replace('{newDeclaration}', '');
//                     }
        
        
//                     fullHtml = dataNew + dataNew1 + dataNew3;
//                     const resumeEntry = new Map<string, any>();

//                     resumeEntry.set("resumeData", resume.resume_data);
//                     resumeEntry.set("html", fullHtml);
//                     resumeEntry.set("id", resume.id);
//                     resumeEntry.set("template_id", templateData.id);
//                     resumeEntry.set("template_image", templateData.image);
                   
                    

//                     resumeArrayData.push(resumeEntry);
        
//                 } else {
//                     console.log(JSON.stringify({ status: 'error', message: 'No record found.' }));
//                 }
//               }

            
//              const formattedResumeArrayData = resumeArrayData.map(entry => mapToObject(entry));
             


//             return apiResponse.successResponse(res, "Resume List", formattedResumeArrayData);
//         } else {
//             return apiResponse.successResponse(res, "No Resume Found", []);
//         }
//     } catch (error) {
//         console.log(error);
//         return apiResponse.errorMessage(res, 400, "Something Went Wrong")
//     }

// }




const mapToObject = (map: Map<string, any>): { [key: string]: any } => {
    const obj: { [key: string]: any } = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
};


// =======================================================================
// =======================================================================

export const updateResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let { resume_id, resume_data } = req.body;
        resume_data = JSON.stringify(resume_data);

        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resume_id, userId]);
        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        const updateSql = `UPDATE resumes SET resume_data = ? WHERE id = ?`;
        const VALUES = [`${resume_data}`, resume_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Resume Updated Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Resume, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const deleteResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const { resume_id } = req.body;
        if (!resume_id) return apiResponse.errorMessage(res, 400, "Resume Id is Required");

        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resume_id, userId]);
        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        const updateSql = `UPDATE resumes SET deleted_at = ? WHERE id = ?`;
        const VALUES = [utility.utcDate(), resume_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Resume Deleted Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Delete Resume, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================


export const resumeList = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;

        const getUserAllTemplate = `SELECT resumes.id AS resume_id, resumes.created_at, templates.image, templates.id FROM resumes LEFT JOIN templates ON resumes.templates_id = templates.id WHERE resumes.user_id = ? AND templates.status = "1" AND resumes.deleted_at IS NULL`;
        const [resumeData]: any = await pool.query(getUserAllTemplate, [userId]);

        return apiResponse.successResponse(res, "Resume List", resumeData);
        
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}


// =======================================================================
// =======================================================================
