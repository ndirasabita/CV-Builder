let educationCount = 0;
let experienceCount = 0;
let certificateCount = 0;
let photoDataURL = null;

// Initialize with one of each
window.onload = function() {
    addEducation();
    addExperience();
    addCertificate();
    loadFromStorage();
};

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoDataURL = e.target.result;
            document.getElementById('photoPreview').src = photoDataURL;
            document.getElementById('photoPreview').classList.add('active');
        };
        reader.readAsDataURL(file);
    }
}

function addEducation() {
    educationCount++;
    const html = `
        <div class="dynamic-item" id="education-${educationCount}">
            <button type="button" class="remove-btn" onclick="removeItem('education-${educationCount}')">✕</button>
            <div class="form-group">
                <label>Institusi</label>
                <input type="text" name="edu-institution-${educationCount}" placeholder="Contoh: Universitas Indonesia">
            </div>
            <div class="form-group">
                <label>Gelar / Jurusan</label>
                <input type="text" name="edu-degree-${educationCount}" placeholder="Contoh: S1 Teknik Informatika">
            </div>
            <div class="form-group">
                <label>Tahun</label>
                <input type="text" name="edu-year-${educationCount}" placeholder="Contoh: 2015 - 2019">
            </div>
        </div>
    `;
    document.getElementById('educationList').insertAdjacentHTML('beforeend', html);
}

function addExperience() {
    experienceCount++;
    const html = `
        <div class="dynamic-item" id="experience-${experienceCount}">
            <button type="button" class="remove-btn" onclick="removeItem('experience-${experienceCount}')">✕</button>
            <div class="form-group">
                <label>Posisi</label>
                <input type="text" name="exp-position-${experienceCount}" placeholder="Contoh: Marketing Manager">
            </div>
            <div class="form-group">
                <label>Perusahaan</label>
                <input type="text" name="exp-company-${experienceCount}" placeholder="Contoh: PT Maju Jaya">
            </div>
            <div class="form-group">
                <label>Periode</label>
                <input type="text" name="exp-period-${experienceCount}" placeholder="Contoh: Jan 2020 - Present">
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea name="exp-description-${experienceCount}" placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."></textarea>
            </div>
        </div>
    `;
    document.getElementById('experienceList').insertAdjacentHTML('beforeend', html);
}

function addCertificate() {
    certificateCount++;
    const html = `
        <div class="dynamic-item" id="certificate-${certificateCount}">
            <button type="button" class="remove-btn" onclick="removeItem('certificate-${certificateCount}')">✕</button>
            <div class="form-group">
                <label>Nama Sertifikat / Penghargaan</label>
                <input type="text" name="cert-name-${certificateCount}" placeholder="Contoh: Google Analytics Certified">
            </div>
            <div class="form-group">
                <label>Penerbit / Organisasi</label>
                <input type="text" name="cert-issuer-${certificateCount}" placeholder="Contoh: Google">
            </div>
            <div class="form-group">
                <label>Tahun</label>
                <input type="text" name="cert-year-${certificateCount}" placeholder="Contoh: 2023">
            </div>
        </div>
    `;
    document.getElementById('certificateList').insertAdjacentHTML('beforeend', html);
}

function removeItem(id) {
    document.getElementById(id).remove();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

document.getElementById('cvForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateCV();
});

function generateCV() {
    const data = collectFormData();
    saveToStorage(data);
    renderCV(data);
    
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('previewSection').classList.add('active');
    window.scrollTo(0, 0);
}

function collectFormData() {
    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        photo: photoDataURL,
        education: [],
        experience: [],
        certificates: []
    };

    // Collect education
    for (let i = 1; i <= educationCount; i++) {
        const item = document.getElementById(`education-${i}`);
        if (item) {
            const institution = document.querySelector(`[name="edu-institution-${i}"]`);
            const degree = document.querySelector(`[name="edu-degree-${i}"]`);
            const year = document.querySelector(`[name="edu-year-${i}"]`);
            
            if (institution && institution.value) {
                data.education.push({
                    institution: institution.value,
                    degree: degree ? degree.value : '',
                    year: year ? year.value : ''
                });
            }
        }
    }

    // Collect experience
    for (let i = 1; i <= experienceCount; i++) {
        const item = document.getElementById(`experience-${i}`);
        if (item) {
            const position = document.querySelector(`[name="exp-position-${i}"]`);
            const company = document.querySelector(`[name="exp-company-${i}"]`);
            const period = document.querySelector(`[name="exp-period-${i}"]`);
            const description = document.querySelector(`[name="exp-description-${i}"]`);
            
            if (position && position.value) {
                data.experience.push({
                    position: position.value,
                    company: company ? company.value : '',
                    period: period ? period.value : '',
                    description: description ? description.value : ''
                });
            }
        }
    }

    // Collect certificates
    for (let i = 1; i <= certificateCount; i++) {
        const item = document.getElementById(`certificate-${i}`);
        if (item) {
            const name = document.querySelector(`[name="cert-name-${i}"]`);
            const issuer = document.querySelector(`[name="cert-issuer-${i}"]`);
            const year = document.querySelector(`[name="cert-year-${i}"]`);
            
            if (name && name.value) {
                data.certificates.push({
                    name: name.value,
                    issuer: issuer ? issuer.value : '',
                    year: year ? year.value : ''
                });
            }
        }
    }

    return data;
}

function renderCV(data) {
    let html = '<div class="cv-header">';
    
    if (data.photo) {
        html += `<img src="${data.photo}" alt="Profile Photo" class="cv-photo">`;
    }
    
    html += `
        <h1>${data.fullName}</h1>
        <div class="cv-contact">${data.email}</div>
        <div class="cv-contact">${data.phone}</div>
        <div class="cv-contact">${data.address}</div>
    </div>`;

    // Summary
    html += `
        <div class="cv-section">
            <div class="cv-section-title">Ringkasan Profesional</div>
            <p class="cv-item-description">${data.summary}</p>
        </div>
    `;

    // Experience
    if (data.experience.length > 0) {
        html += '<div class="cv-section"><div class="cv-section-title">Pengalaman Kerja</div>';
        data.experience.forEach(exp => {
            html += `
                <div class="cv-item">
                    <div class="cv-item-title">${exp.position}</div>
                    <div class="cv-item-subtitle">${exp.company}</div>
                    <div class="cv-item-date">${exp.period}</div>
                    <div class="cv-item-description">${exp.description}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    // Education
    if (data.education.length > 0) {
        html += '<div class="cv-section"><div class="cv-section-title">Pendidikan</div>';
        data.education.forEach(edu => {
            html += `
                <div class="cv-item">
                    <div class="cv-item-title">${edu.degree}</div>
                    <div class="cv-item-subtitle">${edu.institution}</div>
                    <div class="cv-item-date">${edu.year}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    // Skills
    if (data.skills) {
        const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s);
        html += '<div class="cv-section"><div class="cv-section-title">Keahlian</div><div class="skills-list">';
        skillsArray.forEach(skill => {
            html += `<div class="skill-item">${skill}</div>`;
        });
        html += '</div></div>';
    }

    // Certificates
    if (data.certificates.length > 0) {
        html += '<div class="cv-section"><div class="cv-section-title">Sertifikat & Penghargaan</div>';
        data.certificates.forEach(cert => {
            html += `
                <div class="cv-item">
                    <div class="cv-item-title">${cert.name}</div>
                    <div class="cv-item-subtitle">${cert.issuer}</div>
                    <div class="cv-item-date">${cert.year}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    document.getElementById('cv-preview').innerHTML = html;
}

function backToForm() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('previewSection').classList.remove('active');
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('cv-preview');
    
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('CV_ATS_Friendly.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
}

function saveToStorage(data) {
    try {
        const dataToSave = {...data};
        delete dataToSave.photo; // Don't save photo to avoid storage issues
        const formData = {};
        
        // Save basic fields
        formData.fullName = data.fullName;
        formData.email = data.email;
        formData.phone = data.phone;
        formData.address = data.address;
        formData.summary = data.summary;
        formData.skills = data.skills;
        
        // Save arrays as JSON strings
        formData.education = JSON.stringify(data.education);
        formData.experience = JSON.stringify(data.experience);
        formData.certificates = JSON.stringify(data.certificates);
        
        Object.entries(formData).forEach(([key, value]) => {
            localStorage.setItem(`cv_${key}`, value);
        });
    } catch (error) {
        console.log('Storage not available:', error);
    }
}

function loadFromStorage() {
    try {
        const fullName = localStorage.getItem('cv_fullName');
        if (fullName) {
            document.getElementById('fullName').value = fullName;
            document.getElementById('email').value = localStorage.getItem('cv_email') || '';
            document.getElementById('phone').value = localStorage.getItem('cv_phone') || '';
            document.getElementById('address').value = localStorage.getItem('cv_address') || '';
            document.getElementById('summary').value = localStorage.getItem('cv_summary') || '';
            document.getElementById('skills').value = localStorage.getItem('cv_skills') || '';
        }
    } catch (error) {
        console.log('Could not load from storage:', error);
    }
}

function clearForm() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data form? Data yang tersimpan juga akan dihapus.')) {
        // Clear form
        document.getElementById('cvForm').reset();
        
        // Clear photo
        photoDataURL = null;
        document.getElementById('photoPreview').classList.remove('active');
        document.getElementById('photoPreview').src = '';
        
        // Clear dynamic sections
        document.getElementById('educationList').innerHTML = '';
        document.getElementById('experienceList').innerHTML = '';
        document.getElementById('certificateList').innerHTML = '';
        
        // Reset counters
        educationCount = 0;
        experienceCount = 0;
        certificateCount = 0;
        
        // Add fresh sections
        addEducation();
        addExperience();
        addCertificate();
        
        // Clear localStorage
        try {
            const keys = ['cv_fullName', 'cv_email', 'cv_phone', 'cv_address', 'cv_summary', 'cv_skills', 'cv_education', 'cv_experience', 'cv_certificates'];
            keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.log('Could not clear storage:', error);
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        alert('✅ Form berhasil dibersihkan!');
    }
}
