 import React, { useState, useRef } from 'react';
    import { createRoot } from 'react-dom/client';
    import axios from 'axios';
    import {
      MapPin, Phone, User, Settings, Wifi, Zap, Gauge,
      Calendar, MessageSquare, ChevronRight, Building,
      Battery, Sun, Power, X, Plus, Upload, Camera
    } from 'lucide-react';

    // InputField component
    const InputField = ({
      label, value, onChange, type = 'text',
      placeholder, icon: Icon, required = false
    }) => (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />}
          {type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
              rows="3"
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          )}
        </div>
      </div>
    );

    // SiteImageUploader component
    const SiteImageUploader = ({ siteId, apiUrl, onImageUrlUpdate }) => {
      const [imagePreview, setImagePreview] = useState(null);
      const [uploading, setUploading] = useState(false);
      const fileInputRef = useRef(null);

      const handleImageUpload = async (file) => {
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5 MB');
          return;
        }

        try {
          setUploading(true);
          const formData = new FormData();
          formData.append('file', file);
          formData.append('siteId', siteId);

          const uploadRes = await fetch(`http://127.0.0.1:5001/rmstesting-d5aa6/us-central1/firebackend/admin/uploadImage`, {
            method: 'POST',
            body: formData
          });
          if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

          const { success, imageUrl, fileName, message } = await uploadRes.json();
          if (!success) throw new Error(message || 'Upload failed');

          setImagePreview(imageUrl);
          onImageUrlUpdate({ imageUrl, fileName });
          alert('Image uploaded successfully!');
        } catch (err) {
          console.error(err);
          alert(`Error uploading image: ${err.message}`);
        } finally {
          setUploading(false);
        }
      };

      const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file);
      };

      return (
        <div className="w-full relative group">
          {imagePreview ? (
            <img src={imagePreview} alt="Site" className="w-full h-64 object-cover rounded-xl shadow-lg" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-xl shadow-lg">
              <Camera className="w-16 h-16 text-white opacity-60" />
              <p className="ml-2 text-white">Click to upload site image</p>
            </div>
          )}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                <div className="animate-spin h-8 w-8 border-b-2 border-white rounded-full" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white"
          >
            {uploading
              ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
              : <Upload className="w-5 h-5" />
            }
          </button>
        </div>
      );
    };

    // PlantInstallationModal component
    const PlantInstallationModal = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentStep, setCurrentStep] = useState(0);
      const [formData, setFormData] = useState({
        siteId: '',
        siteName: '',
        siteAddress: '',
        contactNumber: '',
        contactPerson: '',
        ebServiceNo: '',
        boardName: '',
        boardConfiguration: '',
        boardEmail: '',
        boardPassword: '',
        simNetwork: '',
        simSerialNumber: '',
        rechargePlan: '',
        simMobileNumber: '',
        dongleBrand: '',
        dongleSerialNumber: '',
        simConfiguration: '',
        batteryCount: '',
        batteryConfiguration: '',
        batteryBrand: '',
        panelCount: '',
        panelConfiguration: '',
        panelBrand: '',
        inverterBrand: '',
        inverterConfiguration: '',
        totalWattage: '',
        actualSolarVoltage: '',
        actualBatteryVoltage: '',
        actualInverterVoltage: '',
        actualGridVoltage: '',
        rmsSolarVoltage: '',
        rmsBatteryVoltage: '',
        rmsInverterVoltage: '',
        rmsGridVoltage: '',
        rmsTime: '',
        installationDate: '',
        engineerName: '',
        designation: '',
        signature: '',
        remarks: '',
        imageUrl: '',
        imageFileName: ''
      });

      const apiUrl = 'http://127.0.0.1:5001/rmstesting-d5aa6/us-central1/firebackend';

      const submitInstallationForm = async (formData) => {
        try {
          const response = await axios.post(
            `${apiUrl}/admin/installationForm`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data.success) {
            console.log('Form submitted successfully! ID:', response.data.id);
            return { success: true, id: response.data.id };
          } else {
            console.warn('Unexpected response:', response.data);
            return { success: false, error: 'Unexpected response format' };
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          if (error.response) {
            return {
              success: false,
              status: error.response.status,
              error: error.response.data?.error || 'Submission failed',
            };
          } else {
            return { success: false, error: 'Network error or no response' };
          }
        }
      };

      const handleSubmit = async () => {
        const result = await submitInstallationForm(formData);
        if (result.success) {
          alert(`Form saved successfully! ID: ${result.id}`);
          closeModal();
        } else {
          alert(`Error: ${result.error}`);
        }
      };

      const steps = [
        { title: 'Site Details', icon: <Building className="w-5 h-5" />, description: 'Basic site information and contact details' },
        { title: 'RMS Board', icon: <Settings className="w-5 h-5" />, description: 'Board configuration and credentials' },
        { title: 'Network', icon: <Wifi className="w-5 h-5" />, description: 'SIM and network specifications' },
        { title: 'Equipment', icon: <Zap className="w-5 h-5" />, description: 'Technical equipment details' },
        { title: 'Measurements', icon: <Gauge className="w-5 h-5" />, description: 'Actual vs RMS measurements' },
        { title: 'Installation', icon: <Calendar className="w-5 h-5" />, description: 'Installation details and remarks' }
      ];

      const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(0);
        resetForm();
      };

      const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(0);
      };

      const resetForm = () => setFormData(prev => Object.keys(prev).reduce((o, k) => ({ ...o, [k]: '' }), {}));

      const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

      const handleImageUrlUpdate = ({ imageUrl, fileName }) => {
        setFormData(prev => ({ ...prev, imageUrl, imageFileName: fileName }));
      };

      const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
      const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

      const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
      };

      const renderStepContent = () => {
        switch (currentStep) {
          case 0:
            return (
              <div className="space-y-6">
                <SiteImageUploader
                  siteId={formData.siteId}
                  apiUrl={apiUrl}
                  onImageUrlUpdate={handleImageUrlUpdate}
                />
                <InputField
                  label="Site Id"
                  value={formData.siteId}
                  onChange={(value) => handleInputChange('siteId', value)}
                  placeholder="Enter site ID"
                  icon={Building}
                  required
                />
                <InputField
                  label="Site Name"
                  value={formData.siteName}
                  onChange={(value) => handleInputChange('siteName', value)}
                  placeholder="Enter site name"
                  icon={Building}
                  required
                />
                <InputField
                  label="Site Address"
                  value={formData.siteAddress}
                  onChange={(value) => handleInputChange('siteAddress', value)}
                  placeholder="Enter complete address"
                  icon={MapPin}
                  type="textarea"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Contact Number"
                    value={formData.contactNumber}
                    onChange={(value) => handleInputChange('contactNumber', value)}
                    placeholder="Enter contact number"
                    icon={Phone}
                    required
                  />
                  <InputField
                    label="Contact Person Name"
                    value={formData.contactPerson}
                    onChange={(value) => handleInputChange('contactPerson', value)}
                    placeholder="Enter contact person name"
                    icon={User}
                    required
                  />
                </div>
                <InputField
                  label="EB Service Number"
                  value={formData.ebServiceNo}
                  onChange={(value) => handleInputChange('ebServiceNo', value)}
                  placeholder="Enter EB service number"
                  icon={Power}
                />
              </div>
            );

          case 1:
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Board Name"
                    value={formData.boardName}
                    onChange={(value) => handleInputChange('boardName', value)}
                    placeholder="Enter board name"
                    icon={Settings}
                    required
                  />
                  <InputField
                    label="Board Configuration"
                    value={formData.boardConfiguration}
                    onChange={(value) => handleInputChange('boardConfiguration', value)}
                    placeholder="Enter configuration (e.g., 24V)"
                    icon={Settings}
                    required
                  />
                </div>
                <InputField
                  label="Board Email ID"
                  value={formData.boardEmail}
                  onChange={(value) => handleInputChange('boardEmail', value)}
                  placeholder="Enter board email ID"
                  type="email"
                  icon={Settings}
                />
                <InputField
                  label="Password"
                  value={formData.boardPassword}
                  onChange={(value) => handleInputChange('boardPassword', value)}
                  placeholder="Enter password"
                  type="password"
                  icon={Settings}
                />
              </div>
            );

          case 2:
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="SIM Network"
                    value={formData.simNetwork}
                    onChange={(value) => handleInputChange('simNetwork', value)}
                    placeholder="Enter SIM network"
                    icon={Wifi}
                    required
                  />
                  <InputField
                    label="SIM Serial Number"
                    value={formData.simSerialNumber}
                    onChange={(value) => handleInputChange('simSerialNumber', value)}
                    placeholder="Enter SIM serial number"
                    icon={Wifi}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Recharge Plan for SIM"
                    value={formData.rechargePlan}
                    onChange={(value) => handleInputChange('rechargePlan', value)}
                    placeholder="Enter recharge plan"
                    icon={Wifi}
                    required
                  />
                  <InputField
                    label="SIM Mobile Number"
                    value={formData.simMobileNumber}
                    onChange={(value) => handleInputChange('simMobileNumber', value)}
                    placeholder="Enter mobile number"
                    icon={Phone}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Dongle Brand"
                    value={formData.dongleBrand}
                    onChange={(value) => handleInputChange('dongleBrand', value)}
                    placeholder="Enter dongle brand"
                    icon={Wifi}
                    required
                  />
                  <InputField
                    label="Dongle Serial Number"
                    value={formData.dongleSerialNumber}
                    onChange={(value) => handleInputChange('dongleSerialNumber', value)}
                    placeholder="Enter dongle serial number"
                    icon={Wifi}
                    required
                  />
                </div>
                <InputField
                  label="SIM Configuration"
                  value={formData.simConfiguration}
                  onChange={(value) => handleInputChange('simConfiguration', value)}
                  placeholder="Enter SIM configuration"
                  icon={Wifi}
                />
              </div>
            );

          case 3:
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Number of Batteries"
                    value={formData.batteryCount}
                    onChange={(value) => handleInputChange('batteryCount', value)}
                    placeholder="Enter count"
                    icon={Battery}
                    required
                  />
                  <InputField
                    label="Battery Configuration"
                    value={formData.batteryConfiguration}
                    onChange={(value) => handleInputChange('batteryConfiguration', value)}
                    placeholder="Enter configuration"
                    icon={Battery}
                    required
                  />
                  <InputField
                    label="Battery Brand"
                    value={formData.batteryBrand}
                    onChange={(value) => handleInputChange('batteryBrand', value)}
                    placeholder="Enter brand"
                    icon={Battery}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Number of Panels"
                    value={formData.panelCount}
                    onChange={(value) => handleInputChange('panelCount', value)}
                    placeholder="Enter count"
                    icon={Sun}
                    required
                  />
                  <InputField
                    label="Panel Configuration"
                    value={formData.panelConfiguration}
                    onChange={(value) => handleInputChange('panelConfiguration', value)}
                    placeholder="Enter configuration"
                    icon={Sun}
                    required
                  />
                  <InputField
                    label="Panel Brand"
                    value={formData.panelBrand}
                    onChange={(value) => handleInputChange('panelBrand', value)}
                    placeholder="Enter brand"
                    icon={Sun}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Inverter Brand"
                    value={formData.inverterBrand}
                    onChange={(value) => handleInputChange('inverterBrand', value)}
                    placeholder="Enter brand"
                    icon={Power}
                    required
                  />
                  <InputField
                    label="Inverter Configuration"
                    value={formData.inverterConfiguration}
                    onChange={(value) => handleInputChange('inverterConfiguration', value)}
                    placeholder="Enter configuration"
                    icon={Power}
                    required
                  />
                  <InputField
                    label="Total Wattage of Loads"
                    value={formData.totalWattage}
                    onChange={(value) => handleInputChange('totalWattage', value)}
                    placeholder="Ex. 500 watts"
                    icon={Zap}
                    required
                  />
                </div>
              </div>
            );

          case 4:
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <Gauge className="w-5 h-5 mr-2" />
                      Actual Measurements
                    </h4>
                    <div className="space-y-4">
                      <InputField
                        label="Solar - Voltage / Ampere"
                        value={formData.actualSolarVoltage}
                        onChange={(value) => handleInputChange('actualSolarVoltage', value)}
                        placeholder="Enter solar measurements"
                        icon={Sun}
                      />
                      <InputField
                        label="Battery 1,2,3,4 - Voltage / Ampere"
                        value={formData.actualBatteryVoltage}
                        onChange={(value) => handleInputChange('actualBatteryVoltage', value)}
                        placeholder="Enter battery measurements"
                        icon={Battery}
                      />
                      <InputField
                        label="Inverter - Voltage / Ampere"
                        value={formData.actualInverterVoltage}
                        onChange={(value) => handleInputChange('actualInverterVoltage', value)}
                        placeholder="Enter inverter measurements"
                        icon={Power}
                      />
                      <InputField
                        label="Grid - Voltage / Ampere"
                        value={formData.actualGridVoltage}
                        onChange={(value) => handleInputChange('actualGridVoltage', value)}
                        placeholder="Enter grid measurements"
                        icon={Zap}
                      />
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      RMS Measurements
                    </h4>
                    <div className="space-y-4">
                      <InputField
                        label="Solar - Voltage / Ampere"
                        value={formData.rmsSolarVoltage}
                        onChange={(value) => handleInputChange('rmsSolarVoltage', value)}
                        placeholder="Enter solar measurements"
                        icon={Sun}
                      />
                      <InputField
                        label="Battery 1,2,3,4 - Voltage / Ampere"
                        value={formData.rmsBatteryVoltage}
                        onChange={(value) => handleInputChange('rmsBatteryVoltage', value)}
                        placeholder="Enter battery measurements"
                        icon={Battery}
                      />
                      <InputField
                        label="Inverter - Voltage / Ampere"
                        value={formData.rmsInverterVoltage}
                        onChange={(value) => handleInputChange('rmsInverterVoltage', value)}
                        placeholder="Enter inverter measurements"
                        icon={Power}
                      />
                      <InputField
                        label="Grid - Voltage / Ampere"
                        value={formData.rmsGridVoltage}
                        onChange={(value) => handleInputChange('rmsGridVoltage', value)}
                        placeholder="Enter grid measurements"
                        icon={Zap}
                      />
                      <InputField
                        label="Time"
                        value={formData.rmsTime}
                        onChange={(value) => handleInputChange('rmsTime', value)}
                        placeholder="Enter measurement time"
                        icon={Calendar}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );

          case 5:
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Date of Installation"
                    value={formData.installationDate}
                    onChange={(value) => handleInputChange('installationDate', value)}
                    type="date"
                    icon={Calendar}
                    required
                  />
                  <InputField
                    label="Engineer Name"
                    value={formData.engineerName}
                    onChange={(value) => handleInputChange('engineerName', value)}
                    placeholder="Enter engineer name"
                    icon={User}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Designation"
                    value={formData.designation}
                    onChange={(value) => handleInputChange('designation', value)}
                    placeholder="Enter designation"
                    icon={User}
                    required
                  />
                  <InputField
                    label="Signature"
                    value={formData.signature}
                    onChange={(value) => handleInputChange('signature', value)}
                    placeholder="Enter signature"
                    icon={User}
                  />
                </div>
                <InputField
                  label="Remarks"
                  value={formData.remarks}
                  onChange={(value) => handleInputChange('remarks', value)}
                  placeholder="Enter any additional remarks"
                  icon={MessageSquare}
                  type="textarea"
                />
              </div>
            );

          default:
            return null;
        }
      };

      return (
        <div>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 font-medium transition shadow flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Plant
          </button>

          {isModalOpen && (
            <div
              onClick={handleOverlayClick}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 min-h-screen"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Plant Installation Form</h2>
                    <p className="text-blue-100">Complete the installation details step by step</p>
                  </div>
                  <button onClick={closeModal} className="hover:text-gray-200">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                  <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition ${
                            index === currentStep
                              ? 'bg-blue-600 text-white shadow-lg'
                              : index < currentStep
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {step.icon}
                          <span className="hidden sm:inline">{step.title}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        className="bg-blue-600 h-2 rounded-full transition"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                      {steps[currentStep].icon}
                      <span className="ml-2">{steps[currentStep].title}</span>
                    </h3>
                    <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
                    {renderStepContent()}
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>

                    {currentStep === steps.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow"
                      >
                        Submit Form
                      </button>
                    ) : (
                      <button
                        onClick={nextStep}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow flex items-center"
                      >
                        Next
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    export default PlantInstallationModal;