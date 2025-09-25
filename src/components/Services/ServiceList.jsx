import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Tabs, Tab, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ServiceList = ({ onServiceSelect, selectedServices = [] }) => {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	// Get company_id from URL parameters
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const companyId = params.get('company_id');

	useEffect(() => {
		const fetchServices = async () => {
			try {
				if (!companyId) {
					throw new Error('Company ID is required');
				}
				const response = await axios.get(`http://127.0.0.1:8000/api/v1/services/companies/${companyId}/services`);
				// Transform the response data into a flat array with category information
				const transformedServices = response.data.data.flatMap(category =>
					category.services.map(service => ({
						...service,
						category: category.name,
						title: service.name,
						duration: `${service.duration} min`,
						price: service.discount_price ? `€${service.discount_price}` : `€${service.price}`,
						description: service.additional_info
					}))
				);
				setServices(transformedServices);
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchServices();
	}, [companyId]);

	// Get unique categories from services
	const categories = ['all', ...new Set(services.map(service => service.category))];

	// Filter services by selected category
	const filteredServices = selectedCategory === 'all' 
		? services 
		: services.filter(service => service.category === selectedCategory);

	const handleServiceToggle = (service) => {
		const isSelected = selectedServices.some(s => s.id === service.id);
		let newSelected;

		if (isSelected) {
			// Remove service if already selected
			newSelected = selectedServices.filter(s => s.id !== service.id);
		} else {
			// Add service if not selected
			newSelected = [...selectedServices, service];
		}

		// Call the parent's onServiceSelect with updated selection
		onServiceSelect(newSelected);
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
				<CircularProgress sx={{ color: '#0D9488' }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
				<Typography color="error">{error}</Typography>
			</Box>
		);
	}

	return (
		<Box>
			{/* Category Tabs */}
			<Tabs 
				value={selectedCategory}
				onChange={(e, newValue) => setSelectedCategory(newValue)}
				sx={{ 
					mb: 2,
					borderBottom: 1,
					borderColor: 'divider',
					'& .MuiTab-root': {
						color: '#666',
						'&.Mui-selected': {
							color: '#0D9488',
						},
					},
					'& .MuiTabs-indicator': {
						backgroundColor: '#0D9488',
					},
				}}
			>
				{categories.map((category) => (
					<Tab 
						key={category} 
						label={category.charAt(0).toUpperCase() + category.slice(1)} 
						value={category}
					/>
				))}
			</Tabs>

			{/* Scrollable Services List */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: 'auto',
					overflow: 'auto',
					'&::-webkit-scrollbar': {
						width: '8px',
					},
					'&::-webkit-scrollbar-track': {
						background: '#f1f1f1',
						borderRadius: '4px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#0D9488',
						borderRadius: '4px',
						'&:hover': {
							background: '#14B8A6',
						},
					},
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
					{filteredServices.map((service) => (
						<Paper
							key={service.id}
							elevation={0}
							sx={{
								border: selectedServices.some(s => s.id === service.id)
									? '2px solid #0D9488'
									: '1px solid #e0e0e0',
								borderRadius: 2,
								overflow: 'hidden',
								cursor: 'pointer',
								'&:hover': {
									backgroundColor: '#f8f8f8'
								}
							}}
							onClick={() => handleServiceToggle(service)}
						>
							<Box sx={{ p: 2, position: 'relative' }}>
								{/* Service Content Container */}
								<Box 
									sx={{ 
										pr: { xs: 0, sm: 5 },
										mb: { xs: 4, sm: 0 }
									}}
								>
									<Typography
										variant="h6"
										sx={{
											fontSize: { xs: '1rem', sm: '1.25rem' },
											lineHeight: 1.3,
											mb: 1
										}}
									>
										{service.title}
									</Typography>

									<Typography
										color="text.secondary" 
										sx={{ 
											fontSize: '0.875rem',
											mb: { xs: 1, sm: 0 }
										}}
									>
										{service.duration} • {service.category}
									</Typography>

									{service.description && (
										<Typography 
											color="text.secondary" 
											sx={{ 
												mt: 1, 
												fontSize: { xs: '0.75rem', sm: '0.875rem' },
												lineHeight: { xs: 1.4, sm: 1.5 },
												mb: { xs: 2, sm: 0 },
												maxHeight: { xs: '3.6em', sm: 'none' },
												overflow: { xs: 'hidden', sm: 'visible' },
												WebkitLineClamp: { xs: 3, sm: 'unset' },
												display: '-webkit-box',
												WebkitBoxOrient: 'vertical',
												textOverflow: 'ellipsis'
											}}
										>
											{service.description}
										</Typography>
									)}
								</Box>

								{/* Price and Action Button Container */}
								<Box 
									sx={{ 
										position: { xs: 'absolute', sm: 'absolute' },
										bottom: { xs: 16, sm: 'auto' },
										top: { xs: 'auto', sm: 16 },
										right: 16,
										display: 'flex',
										alignItems: 'center',
										gap: 1
									}}
								>
									<Typography 
										variant="h6" 
										color="text.primary"
										sx={{
											fontSize: { xs: '1rem', sm: '1.25rem' }
										}}
									>
										{service.price}
									</Typography>
									<IconButton 
										size="small" 
										sx={{
											bgcolor: selectedServices.some(s => s.id === service.id) ? '#0D9488' : '#f5f5f5',
											color: selectedServices.some(s => s.id === service.id) ? 'white' : '#666',
											'&:hover': {
												bgcolor: selectedServices.some(s => s.id === service.id) ? '#14B8A6' : '#e0e0e0'
											}
										}}
									>
										{selectedServices.some(s => s.id === service.id) ? <CheckIcon /> : <AddIcon />}
									</IconButton>
								</Box>
							</Box>
						</Paper>
					))}
				</Box>
			</Box>
		</Box>
	);
};

export default ServiceList;