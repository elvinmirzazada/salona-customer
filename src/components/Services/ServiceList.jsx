import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

const services = [
	{
		id: 1,
		title: "Men's Hairdresser | Men's Hairdresser",
		subtitle: "Haircut for men (wash + blow dry) | Men's haircut (wash + blow dry)",
		duration: "40 mins - 1 hr",
		price: "€36",
		clientType: "Male only",
		category: "Haircut"
	},
	{
		id: 2,
		title: "Beard trimming, neck cleaning | Beard trimming, neck cleaning",
		duration: "30 mins",
		price: "€20",
		clientType: "Male only",
		category: "Beard"
	},
	{
		id: 3,
		title: "Hair toning | Hair coloring",
		duration: "1 hr",
		price: "€41",
		category: "Color"
	},
	{
		id: 4,
		title: "Hair toning+cutting | Hair coloring + haircut",
		duration: "1 hr",
		price: "€76",
		description: "Tinting refreshes the natural hair color and reduces the visibility of gray hair.",
		category: "Color"
	},
	{
		id: 5,
		title: "Hair toning+cutting | Hair coloring + haircut",
		duration: "1 hr",
		price: "€76",
		description: "Tinting refreshes the natural hair color and reduces the visibility of gray hair.",
		category: "Color"
	},
	{
		id: 6,
		title: "Hair toning+cutting | Hair coloring + haircut",
		duration: "1 hr",
		price: "€76",
		description: "Tinting refreshes the natural hair color and reduces the visibility of gray hair.",
		category: "Color"
	}
];

const ServiceList = ({ onServiceSelect, selectedServices = [] }) => {
	const [selectedCategory, setSelectedCategory] = useState('all');

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
									{service.subtitle ? (
										<>
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
													fontSize: { xs: '0.875rem', sm: '1rem' },
													mb: 1
												}}
											>
												{service.subtitle}
											</Typography>
										</>
									) : (
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
									)}
									<Typography 
										color="text.secondary" 
										sx={{ 
											fontSize: '0.875rem',
											mb: { xs: 1, sm: 0 }
										}}
									>
										{service.duration} {service.clientType && `• ${service.clientType}`}
									</Typography>
									{service.description && (
										<Typography 
											color="text.secondary" 
											sx={{ 
												mt: 1, 
												fontSize: { xs: '0.75rem', sm: '0.875rem' },
												lineHeight: { xs: 1.4, sm: 1.5 },
												mb: { xs: 2, sm: 0 },
												// Remove display none
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
										from {service.price}
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