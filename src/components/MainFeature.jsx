import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import getIcon from '../utils/iconUtils';

function MainFeature({ onUpdate }) {
  // States for the form data
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    size: '',
    cropType: '',
    plantDate: '',
    expectedHarvest: '',
    notes: ''
  });
  
  // State for farms list
  const [farms, setFarms] = useState([]);
  const [activeTab, setActiveTab] = useState('farms');
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [cropFormData, setCropFormData] = useState({
    cropName: '',
    plantDate: '',
    expectedHarvest: '',
    notes: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [showFarmSelector, setShowFarmSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get icons
  const FarmIcon = getIcon('Warehouse');
  const LocationIcon = getIcon('MapPin');
  const CropIcon = getIcon('Sprout');
  const CalendarIcon = getIcon('Calendar');
  const NoteIcon = getIcon('FileText');
  const PlusIcon = getIcon('PlusCircle');
  const EditIcon = getIcon('Edit3');
  const TrashIcon = getIcon('Trash2');
  const SaveIcon = getIcon('Save');
  const CloseIcon = getIcon('X');
  const ChevronRightIcon = getIcon('ChevronRight');
  const ChevronDownIcon = getIcon('ChevronDown');
  
  // Tab options
  const tabs = [
    { id: 'farms', label: 'Farms', icon: 'Warehouse' },
    { id: 'crops', label: 'Crops', icon: 'Sprout' },
    { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
  ];
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const storedFarms = localStorage.getItem('cropkeeper_farms');
    if (storedFarms) {
      setFarms(JSON.parse(storedFarms));
    }
  }, []);
  
  // Update localStorage when farms change
  useEffect(() => {
    localStorage.setItem('cropkeeper_farms', JSON.stringify(farms));
    // Update the parent component stats
    if (onUpdate) {
      onUpdate({
        farms: farms.length,
        crops: farms.reduce((total, farm) => total + (farm.crops?.length || 0), 0),
        tasks: farms.reduce((total, farm) => total + (farm.tasks?.length || 0), 0),
      });
    }
  }, [farms, onUpdate]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.farmName.trim()) errors.farmName = "Farm name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.size || isNaN(formData.size) || Number(formData.size) <= 0) {
      errors.size = "Please enter a valid farm size";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateCropForm = () => {
    const errors = {};
    
    if (!cropFormData.cropName.trim()) {
      errors.cropName = "Crop name is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleCropInputChange = (e) => {
    const { name, value } = e.target;
    setCropFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call or processing delay
    setTimeout(() => {
      const newFarm = {
        id: Date.now().toString(),
        name: formData.farmName,
        location: formData.location,
        size: Number(formData.size),
        dateAdded: new Date().toISOString(),
        crops: formData.cropType ? [{
          id: Date.now().toString() + '-crop',
          name: formData.cropType,
          plantedDate: formData.plantDate,
          expectedHarvestDate: formData.expectedHarvest,
          notes: formData.notes
        }] : [],
        tasks: [],
        expanded: false
      };
      
      setFarms(prev => [...prev, newFarm]);
      
      // Reset form
      setFormData({
        farmName: '',
        location: '',
        size: '',
        cropType: '',
        plantDate: '',
        expectedHarvest: '',
        notes: ''
      });
      
      setIsSubmitting(false);
    }, 800);
  };
  
  const handleCropFormOpen = (farmId = null) => {
    // Handle the case when no farms exist
    if (farms.length === 0) {
      alert("Please create a farm first before adding crops.");
      return;
    }
    
    // Set farm selector visibility if no specific farm is selected
    const shouldShowSelector = !farmId && farms.length > 0;
    
    setSelectedFarmId(farmId);
    setShowFarmSelector(shouldShowSelector);
    setIsModalOpen(true);
    setCropFormData({
      cropName: '',
      plantDate: '',
      expectedHarvest: '',
      notes: ''
    });
    setFormErrors({});
  };
  
  const handleCropFormClose = () => {
    setIsModalOpen(false);
    setSelectedFarmId(null);
  };
  
  const handleCropSubmit = (e) => {
    e.preventDefault();
    

    // Get the selected farmId from the dropdown if no farmId was passed
    const farmId = selectedFarmId || document.getElementById('farmSelector').value;
    
    if (!farmId) {
      setFormErrors({...formErrors, farmSelector: "Please select a farm"});
      return;
    }
    if (!validateCropForm()) {
      return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newCrop = {
        id: Date.now().toString() + '-crop',
        name: cropFormData.cropName,
        plantedDate: cropFormData.plantDate,
        expectedHarvestDate: cropFormData.expectedHarvest,
        notes: cropFormData.notes
      };
      
      setFarms(prev => prev.map(farm =>
        farm.id === farmId
          ? { ...farm, crops: [...(farm.crops || []), newCrop] } 
          : farm
      ));
      
      setIsSubmitting(false);
      handleCropFormClose();
    }, 800);
    }
  
  const toggleFarmExpand = (farmId) => {
    setFarms(prev => 
      prev.map(farm => 
        farm.id === farmId 
          ? { ...farm, expanded: !farm.expanded } 
          : farm
      )
    );
  };
  
  const deleteFarm = (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      setFarms(prev => prev.filter(farm => farm.id !== farmId));
    }
  };
  
  return (
    <div className="card-neu p-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-2">
          Farm Management
        </h2>
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                ? 'bg-primary text-white dark:bg-primary-light dark:text-surface-900 font-medium'
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300'
              }`}
            >
              {React.createElement(getIcon(tab.icon), { className: "h-4 w-4" })}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === 'farms' && (
          <motion.div
            key="farms-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-surface-200 dark:border-surface-700">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <PlusIcon className="h-5 w-5 text-primary" />
                Add New Farm
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="farmName" className="form-label flex items-center gap-1">
                    <FarmIcon className="h-4 w-4" />
                    Farm Name*
                  </label>
                  <input
                    type="text"
                    id="farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    className={`input-field ${formErrors.farmName ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="Sunrise Valley Farm"
                  />
                  {formErrors.farmName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.farmName}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="location" className="form-label flex items-center gap-1">
                    <LocationIcon className="h-4 w-4" />
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`input-field ${formErrors.location ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="County, State"
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="size" className="form-label flex items-center gap-1">
                    Size (acres)*
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    min="0.1"
                    step="0.1"
                    value={formData.size}
                    onChange={handleInputChange}
                    className={`input-field ${formErrors.size ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="10.5"
                  />
                  {formErrors.size && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.size}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="cropType" className="form-label flex items-center gap-1">
                    <CropIcon className="h-4 w-4" />
                    Main Crop (optional)
                  </label>
                  <input
                    type="text"
                    id="cropType"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Corn, Wheat, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="plantDate" className="form-label flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Planting Date (optional)
                  </label>
                  <input
                    type="date"
                    id="plantDate"
                    name="plantDate"
                    value={formData.plantDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="expectedHarvest" className="form-label flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Expected Harvest (optional)
                  </label>
                  <input
                    type="date"
                    id="expectedHarvest"
                    name="expectedHarvest"
                    value={formData.expectedHarvest}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="form-group mt-2">
                <label htmlFor="notes" className="form-label flex items-center gap-1">
                  <NoteIcon className="h-4 w-4" />
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="input-field min-h-[80px]"
                  placeholder="Add any additional notes about this farm..."
                ></textarea>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-1" />
                      Save Farm
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-3">Your Farms ({farms.length})</h3>
              
              {farms.length === 0 ? (
                <div className="text-center py-8 bg-surface-50 dark:bg-surface-800 rounded-lg border border-dashed border-surface-300 dark:border-surface-700">
                  <CropIcon className="h-10 w-10 mx-auto text-surface-400 dark:text-surface-600 mb-2" />
                  <p className="text-surface-600 dark:text-surface-400">No farms added yet.</p>
                  <p className="text-sm text-surface-500 dark:text-surface-500 mt-1">
                    Use the form above to add your first farm.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {farms.map(farm => (
                      <motion.div
                        key={farm.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden"
                      >
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer group"
                          onClick={() => toggleFarmExpand(farm.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                              <FarmIcon className="h-5 w-5 text-primary dark:text-primary-light" />
                            </div>
                            <div>
                              <h4 className="font-medium group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                                {farm.name}
                              </h4>
                              <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1">
                                <LocationIcon className="h-3 w-3" />
                                {farm.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFarm(farm.id);
                              }}
                              className="p-1.5 rounded-full text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              aria-label="Delete farm"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            
                            <div className="p-1 rounded-full bg-surface-100 dark:bg-surface-700">
                              {farm.expanded ? 
                                <ChevronDownIcon className="h-4 w-4" /> : 
                                <ChevronRightIcon className="h-4 w-4" />
                              }
                            </div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {farm.expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50"
                            >
                              <div className="p-4">
                                <div className="mb-4">
                                  <h5 className="font-medium text-sm text-surface-600 dark:text-surface-400 mb-2">Farm Details</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div className="bg-white dark:bg-surface-700/50 p-2 rounded">
                                      <span className="text-surface-500 dark:text-surface-400">Size:</span> {farm.size} acres
                                    </div>
                                    <div className="bg-white dark:bg-surface-700/50 p-2 rounded">
                                      <span className="text-surface-500 dark:text-surface-400">Added:</span> {new Date(farm.dateAdded).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mb-2">
                                  <h5 className="font-medium text-sm text-surface-600 dark:text-surface-400 mb-2 flex items-center gap-1">
                                    <CropIcon className="h-4 w-4 text-green-500" />
                                    Crops ({farm.crops?.length || 0})
                                  </h5>
                                  
                                  {farm.crops?.length > 0 ? (
                                    <div className="space-y-2">
                                      {farm.crops.map(crop => (
                                        <div key={crop.id} className="bg-white dark:bg-surface-700/50 p-3 rounded-lg text-sm">
                                          <div className="font-medium">{crop.name}</div>
                                          {crop.plantedDate && (
                                            <div className="text-surface-500 dark:text-surface-400 mt-1">
                                              Planted: {new Date(crop.plantedDate).toLocaleDateString()}
                                            </div>
                                          )}
                                          {crop.expectedHarvestDate && (
                                            <div className="text-surface-500 dark:text-surface-400">
                                              Expected harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                                            </div>
                                          )}
                                          {crop.notes && (
                                            <div className="mt-2 p-2 bg-surface-100 dark:bg-surface-600/50 rounded text-surface-700 dark:text-surface-300">
                                              {crop.notes}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-3 bg-white dark:bg-surface-700/30 rounded border border-dashed border-surface-300 dark:border-surface-600">
                                      <p className="text-sm text-surface-500 dark:text-surface-400">No crops added yet</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="mt-4">
                                  <button 
                                    className="btn btn-outline w-full" 
                                    onClick={() => handleCropFormOpen(farm.id)}
                                  >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Add New Crop
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {activeTab === 'crops' && (
          <motion.div
            key="crops-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700 min-h-[400px] flex flex-col items-center justify-center"
          >
            <CropIcon className="h-16 w-16 text-primary/30 dark:text-primary-light/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Crop Management</h3>
            <p className="text-surface-600 dark:text-surface-400 text-center max-w-md mb-6">
              Here you'll be able to track all your crops across different farms, their planting and harvest schedules, and yield data.
            </p>
            <button className="btn btn-primary" onClick={() => handleCropFormOpen()}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New Crop
            </button>
          </motion.div>
        )}
        
        {activeTab === 'expenses' && (
          <motion.div
            key="expenses-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700 min-h-[400px] flex flex-col items-center justify-center"
          >
            <div className="h-16 w-16 flex items-center justify-center text-primary/30 dark:text-primary-light/30 mb-4">
              {React.createElement(getIcon('Receipt'), { className: "h-16 w-16" })}
            </div>
            <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
            <p className="text-surface-600 dark:text-surface-400 text-center max-w-md mb-6">
              Record and categorize all your farm-related expenses, generate reports, and gain insights into your farm's financial health.
            </p>
            <button className="btn btn-primary">
              <PlusIcon className="h-4 w-4 mr-1" />
              Record Expense
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crop Form Modal */}
      <CropFormModal 
        isOpen={isModalOpen}
        onClose={handleCropFormClose}
        onSubmit={handleCropSubmit}
        cropFormData={cropFormData}
        handleCropInputChange={handleCropInputChange}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        showFarmSelector={showFarmSelector}
        farms={farms}
      />
    </div>
  );
}

// Crop Form Modal Component
function CropFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  cropFormData, 
  handleCropInputChange, 
  formErrors, 
  isSubmitting, 
  showFarmSelector, 
  farms 
}) {
  const CropIcon = getIcon('Sprout');
  const FarmIcon = getIcon('Warehouse');
  const CloseIcon = getIcon('X');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-surface-900/50 dark:bg-surface-900/80 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CropIcon className="h-5 w-5 text-green-500" />
            Add New Crop
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Close modal"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-4">
          {showFarmSelector && (
            <div className="form-group mb-4">
              <label htmlFor="farmSelector" className="form-label flex items-center gap-1">
                <FarmIcon className="h-4 w-4" />
                Select Farm*
              </label>
              <select 
                id="farmSelector" 
                className={`input-field ${formErrors.farmSelector ? 'border-red-500 dark:border-red-400' : ''}`}
              >
                <option value="">Select a farm</option>
                {farms.map(farm => (
                  <option key={farm.id} value={farm.id}>{farm.name}</option>
                ))}
              </select>
              {formErrors.farmSelector && (
                <p className="text-red-500 text-xs mt-1">{formErrors.farmSelector}</p>
              )}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="cropName" className="form-label flex items-center gap-1">
              <CropIcon className="h-4 w-4" />
              Crop Name*
            </label>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={cropFormData.cropName}
              onChange={handleCropInputChange}
              className={`input-field ${formErrors.cropName ? 'border-red-500 dark:border-red-400' : ''}`}
              placeholder="Corn, Wheat, etc."
            />
            {formErrors.cropName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.cropName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="plantDate" className="form-label">Planting Date</label>
              <input type="date" id="plantDate" name="plantDate" value={cropFormData.plantDate} onChange={handleCropInputChange} className="input-field" />
            </div>
            
            <div className="form-group">
              <label htmlFor="expectedHarvest" className="form-label">Expected Harvest</label>
              <input type="date" id="expectedHarvest" name="expectedHarvest" value={cropFormData.expectedHarvest} onChange={handleCropInputChange} className="input-field" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cropNotes" className="form-label">Notes</label>
            <textarea id="cropNotes" name="notes" value={cropFormData.notes} onChange={handleCropInputChange} className="input-field min-h-[80px]" placeholder="Add notes about this crop..."></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Crop'}
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

export default MainFeature;