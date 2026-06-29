import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';

const AddListingPage = () => {
    const [formData, setFormData] = useState({
        foodName: '',
        category: 'cooked',
        quantity: '',
        unit: 'kg',
        pickupTime: '',
        expiryTime: '',
        description: '',
        listingType: 'regular',
        isDiscounted: false,
        price: '',
        originalPrice: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) {
            data.append('image', image);
        }

        try {
            await api.post('/listings', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/provider/listings');
        } catch (err) {
            console.error('Listing creation error:', err);
            const message = err.response?.data?.message || 'Failed to add listing';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Add Surplus Food">
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 lg:p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Food Name / Description</label>
                            <input
                                type="text" name="foodName" required
                                placeholder="e.g. 10 Loaves of Fresh Sourdough Bread"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 focus:border-green-600 outline-none"
                                value={formData.foodName} onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                            <select name="category" className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-green-600 outline-none" value={formData.category} onChange={handleInputChange}>
                                <option value="cooked">Cooked Food</option>
                                <option value="raw">Raw Materials</option>
                                <option value="packaged">Packaged Goods</option>
                                <option value="beverages">Beverages</option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                                <input type="number" name="quantity" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.quantity} onChange={handleInputChange} />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                                <select name="unit" className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none font-bold" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">KG</option>
                                    <option value="portions">Portions</option>
                                    <option value="boxes">Boxes</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Available for Pickup</label>
                            <input type="datetime-local" name="pickupTime" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.pickupTime} onChange={handleInputChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Expires At</label>
                            <input type="datetime-local" name="expiryTime" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.expiryTime} onChange={handleInputChange} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes (Optional)</label>
                            <textarea name="description" rows="3" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 outline-none" value={formData.description} onChange={handleInputChange}></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Food Image</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="food-image"
                                />
                                <label
                                    htmlFor="food-image"
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-green-600 hover:bg-green-50 transition-all"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="text-4xl mb-2">📸</div>
                                        <p className="text-sm text-slate-500 font-bold">
                                            {image ? image.name : "Click to upload food photo"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
                        <div className="text-2xl">🌱</div>
                        <p className="text-sm text-green-800 font-medium">By listing this food, you confirm it is safe for consumption and stored according to hygiene standards.</p>
                    </div>

                    {/* Student Deal Section */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-black text-slate-900">Student Discount Deal</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Make this surplus food available to students at a discount</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    name="isDiscounted"
                                    checked={formData.isDiscounted}
                                    onChange={(e) => setFormData({ ...formData, isDiscounted: e.target.checked })}
                                />
                                <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        {formData.isDiscounted && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Original Price ($)</label>
                                    <input
                                        type="number" name="originalPrice"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-green-600"
                                        value={formData.originalPrice} onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Discounted Deal Price ($)</label>
                                    <input
                                        type="number" name="price"
                                        className="w-full px-5 py-4 rounded-2xl border border-green-200 bg-white text-slate-900 outline-none focus:border-green-600 shadow-sm shadow-green-100"
                                        value={formData.price} onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-100 uppercase tracking-widest"
                    >
                        {loading ? 'Posting...' : 'List Surplus Food'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AddListingPage;
