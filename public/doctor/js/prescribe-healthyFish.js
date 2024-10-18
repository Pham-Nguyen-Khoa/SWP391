const pondCount = localStorage.getItem('pondCount'); 
    const informationDataFishes = localStorage.getItem('appointmentHealthyData');
    const informationDataFishesJS = JSON.parse(informationDataFishes);
    const fishCount = informationDataFishesJS.length


    const medicationCardsContainer = document.querySelector('.medication-cards');

    for (let i = 1; i <= fishCount; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      card.style = 'box-shadow: 0px 1px 15px 4px rgb(0 0 0 / 30%); border-radius: 8px; border: none; margin-bottom: 100px; background-color: #f7fbff; padding-bottom: 20px;';
      card.innerHTML = `
        <div class="card-header" style="background-color: #C7E3ED; font-weight: bold; font-size: 1.3em; padding: 15px; border-top-left-radius: 8px; border-top-right-radius: 8px;">Đơn thuốc cho cá ${i}</div>
        <div class="card-body">
             <div class="tinymce-content" style="border: 1px solid #ddd; padding: 10px; min-height: 200px; max-height: 400px; overflow-y: auto;">
                ${informationDataFishesJS[i-1].Avatar || 'Không có nội dung'}
              </div>
          <div class="form-group">
            <label for="medicationSelect${i}">Chọn thuốc</label>
            <select class="form-control medication-select" id="medicationSelect${i}" name="medicationSelect${i}">
              <option value="">-- Chọn thuốc --</option>
            </select>
          </div>
          <table class="table prescription-table text-center" id="prescriptionTable${i}">
            <thead>
              <tr>
                <th class="text-center">Hình ảnh</th>
                <th class="text-center">Tên thuốc</th>
                <th class="text-center">Công dụng</th>
                <th class="text-center">Số Lượng</th>
                <th class="text-center">Chai/Lọ/Viên</th>
                <th class="text-center">Sáng</th>
                <th class="text-center">Trưa</th>
                <th class="text-center">Chiều</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      `;
      medicationCardsContainer.appendChild(card);
    }

    document.querySelectorAll('.medication-select').forEach(selectElement => {
      medications.forEach(med => {
        const option = document.createElement('option');
        option.value = med.MedicineID;
        option.textContent = med.Name;
        selectElement.appendChild(option);
      });

      selectElement.addEventListener('change', function() {
        const selectedMed = medications.find(med => med.MedicineID == this.value);
        if (selectedMed) {
          const tableId = this.id.replace('medicationSelect', 'prescriptionTable');
          const prescriptionTable = document.getElementById(tableId).getElementsByTagName('tbody')[0];
          addOrUpdateMedicationInTable(selectedMed, prescriptionTable, tableId);
          this.value = '';
        }
      });
    });

    function addOrUpdateMedicationInTable(medication, prescriptionTable, tableId) {
      const existingRow = Array.from(prescriptionTable.rows).find(row => row.cells[1].textContent === medication.Name);

      if (!existingRow) {
        const row = prescriptionTable.insertRow();
        row.dataset.medicineId = medication.MedicineID; 
        row.innerHTML = `
          <td><img src="${medication.Image}" alt="${medication.Name}" style="width: 100px; height: 100px; object-fit: cover;"></td>
          <td>${medication.NameEnglish}</td>
          <td>${medication.Name}</td>
          <td><input type="number" class="form-control" min="1" value="1"></td>
          <td>${medication.Unit}</td>
          <td><input type="text" class="form-control" ></td>
          <td><input type="text" class="form-control" ></td>
          <td><input type="text" class="form-control" ></td>
          <td><button type="button" class="btn btn-danger btn-sm" style="width:90px" onclick="removeMedication(this, '${tableId}', '${medication.MedicineID}')">Xóa</button></td>
        `;
        saveFormData();
      }
    }

    function removeMedication(button, tableId, medicationID) {
      const row = button.closest('tr');
      row.remove();
      saveFormData();
    }

    function saveFormData() {
      const prescriptionData = [];
      for (let i = 1; i <= fishCount; i++) {
        const prescriptionTable = document.getElementById(`prescriptionTable${i}`).getElementsByTagName('tbody')[0];
        //- const medicationIDs = Array.from(prescriptionTable.rows).map(row => row.dataset.medicineId);
        const medications = Array.from(prescriptionTable.rows).map(row => {
          return {
            medicineId: row.dataset.medicineId,
            quantity: row.cells[3].querySelector('input').value,
            unit: row.cells[4].innerHTML,
            morning: row.cells[5].querySelector('input').value,
            noon: row.cells[6].querySelector('input').value,
            evening: row.cells[7].querySelector('input').value
          };
        }); 
        prescriptionData.push({
          fish: i,
          medications: medications
        });
      }
      localStorage.setItem('prescriptionData', JSON.stringify(prescriptionData));
    }


    function addOrUpdateMedicationInTable(medication, prescriptionTable, tableId) {
      const existingRow = Array.from(prescriptionTable.rows).find(row => row.cells[1].textContent === medication.Name);

        if (!existingRow) {
          const row = prescriptionTable.insertRow();
          row.dataset.medicineId = medication.MedicineID; 
          row.innerHTML = `
            <td><img src="${medication.Image}" alt="${medication.Name}" style="width: 100px; height: 100px; object-fit: cover;"></td>
            <td>${medication.NameEnglish}</td>
            <td>${medication.Name}</td>
            <td><input type="number" class="form-control" min="1" value="1" onchange="saveFormData()"></td>
            <td>${medication.Unit}</td>
            <td><input type="text" class="form-control" onchange="saveFormData()"></td>
            <td><input type="text" class="form-control" onchange="saveFormData()"></td>
            <td><input type="text" class="form-control" onchange="saveFormData()"></td>
            <td><button type="button" class="btn btn-danger btn-sm" style="width:90px" onclick="removeMedication(this, '${tableId}', '${medication.MedicineID}')">Xóa</button></td>
          `;
              attachChangeEventListeners(row);
              saveFormData();
            }
          } 

      function attachChangeEventListeners(row) {
        const inputs = row.querySelectorAll('input');
        console.log(inputs)
        inputs.forEach(input => {
          input.addEventListener('change', saveFormData);
        });
      }


    function restoreFormData() {
      const savedData = localStorage.getItem('prescriptionData');
      if (savedData) {
        const data = JSON.parse(savedData);
        data.forEach(prescription => {
          const prescriptionTable = document.getElementById(`prescriptionTable${prescription.fish}`).getElementsByTagName('tbody')[0];
          prescription.medications.forEach(medication => {
            const med = medications.find(m => m.MedicineID == medication.medicineId);
            if (med) {
              const row = prescriptionTable.insertRow();
          row.dataset.medicineId = med.MedicineID;
          row.innerHTML = `
            <td><img src="${med.Image}" alt="${med.Name}" style="width: 100px; height: 100px; object-fit: cover;"></td>
            <td>${med.NameEnglish}</td>
            <td>${med.Name}</td>
            <td><input type="number" class="form-control" min="1" value="${medication.quantity}"></td>
            <td>${med.Unit}</td>
            <td><input type="text" class="form-control" value="${medication.morning}"></td>
            <td><input type="text" class="form-control" value="${medication.noon}"></td>
            <td><input type="text" class="form-control" value="${medication.evening}"></td>
            <td><button type="button" class="btn btn-danger btn-sm" style="width:90px"  onclick="removeMedication(this, 'prescriptionTable${prescription.pond}', '${med.MedicineID}')">Xóa</button></td>
              `;
              attachChangeEventListeners(row);  
            }
          });
        });
      }
    }

    window.addEventListener('load', restoreFormData);

    const prescriptionForm = document.getElementById('prescriptionForm');
    prescriptionForm.addEventListener('submit', (e) => {
      saveFormData();
      const prescriptionData = localStorage.getItem('prescriptionData');
      const previousPageData = localStorage.getItem('appointmentHealthyData');
      console.log(previousPageData)
      console.log(prescriptionData)
      document.getElementById('previousPageData').value = previousPageData;
      document.getElementById('selectedMedications').value = prescriptionData;
    });


    const payCenter = document.getElementById('payCenter');
    console.log(payCenter)
    if(payCenter){
      const formPayCenter = document.getElementById('formPayCenter');
      console.log(formPayCenter)
      payCenter.addEventListener("click",(e) => {
        e.preventDefault();
        saveFormData();
        const prescriptionData = localStorage.getItem('prescriptionData');
        const previousPageData = localStorage.getItem('appointmentHealthyData');
        document.getElementById('previousPageDataCenter').value = previousPageData;
        document.getElementById('selectedMedicationsCenter').value = prescriptionData;
        formPayCenter.submit();
        localStorage.clear();
      })
    }
    