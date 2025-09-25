import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ProfessionalList = ({ onProfessionalSelect, selectedProfessional, disabled }) => {
	const [professionals, setProfessionals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Get company_id from URL parameters
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const companyId = params.get('company_id');

	useEffect(() => {
		const fetchProfessionals = async () => {
			try {
				if (!companyId) {
					throw new Error('Company ID is required');
				}
				setLoading(true);
				const response = await axios.get(`http://127.0.0.1:8000/api/v1/services/companies/${companyId}/users`);
				console.log('Professionals API response:', response.data);

				// Add "Any professional" option
				const anyProfessional = {
					id: 'any',
					name: 'Any Professional',
					role: 'for maximum availability',
					rating: '5.0',
					avatarUrl: null
				};

				// Transform the API response data
				const transformedProfessionals = response.data.data.map(item => ({
					id: item.user.id,
					name: `${item.user.first_name} ${item.user.last_name}`,
					role: item.role.charAt(0).toUpperCase() + item.role.slice(1),
					rating: '4.9', // Default rating since it's not in the API response
					avatarUrl: null,
					email: item.user.email,
					phone: item.user.phone,
					status: item.status
				})).filter(prof => prof.status === 'active'); // Only show active professionals

				// Combine "Any professional" with the fetched professionals
				setProfessionals([anyProfessional, ...transformedProfessionals]);
				setError(null);
			} catch (err) {
				console.error('Error fetching professionals:', err);
				setError(err.message || 'Failed to fetch professionals');
				setProfessionals([]);
			} finally {
				setLoading(false);
			}
		};

		fetchProfessionals();
	}, [companyId]);

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

	// Determine if any professional is selected
	const isProfessionalSelected = !!selectedProfessional;

	return (
		<Box
			sx={{
				width: '100%',
				overflow: 'hidden',
				opacity: isProfessionalSelected ? 1 : 0.8, // Slightly reduce opacity when no professional is selected
			}}
		>
			<Box
				sx={{
					width: '100%',
					overflowX: 'auto',
					pb: 2,
					mx: { xs: -2, sm: 0 },
					px: { xs: 2, sm: 0 },
				}}
			>
				<Grid
					container
					spacing={2}
					sx={{
						flexWrap: { xs: 'nowrap', sm: 'wrap' },
						width: { xs: 'fit-content', sm: '100%' },
						minWidth: '100%',
					}}
				>
					{professionals.map((professional) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							key={professional.id}
						>
							<Card
								onClick={() => !disabled && onProfessionalSelect(professional)}
								sx={{
									cursor: disabled ? 'default' : 'pointer',
									height: '100%',
									bgcolor: selectedProfessional?.id === professional.id
										? 'primary.50'
										: isProfessionalSelected ? 'background.paper' : 'grey.50',
									borderColor: selectedProfessional?.id === professional.id
										? 'primary.main'
										: isProfessionalSelected ? 'grey.300' : 'grey.200',
									borderWidth: 1,
									borderStyle: 'solid',
									transition: 'all 0.2s ease-in-out',
									opacity: selectedProfessional?.id === professional.id
										? 1
										: isProfessionalSelected ? 0.7 : 0.85,
									'&:hover': {
										borderColor: disabled ? 'grey.300' : 'primary.main',
										boxShadow: disabled ? 0 : 1,
										transform: disabled ? 'none' : 'translateY(-2px)',
										opacity: disabled ? (isProfessionalSelected ? 0.7 : 0.85) : 1
									},
								}}
							>
								<CardContent>
									<Box display="flex" alignItems="center" mb={2}>
										<Avatar
											src={professional.avatarUrl}
											sx={{
												width: 56,
												height: 56,
												bgcolor: professional.id === 'any' ? 'primary.main' : 'secondary.main',
												mr: 2,
												opacity: selectedProfessional?.id === professional.id ? 1 : 0.85
											}}
										>
											{professional.name.charAt(0)}
										</Avatar>
										<Box>
											<Typography
												variant="h6"
												gutterBottom
												sx={{
													color: isProfessionalSelected && selectedProfessional?.id !== professional.id
														? 'text.secondary'
														: 'text.primary'
												}}
											>
												{professional.name}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{
													opacity: isProfessionalSelected && selectedProfessional?.id !== professional.id
														? 0.8
														: 1
												}}
											>
												{professional.role}
											</Typography>
										</Box>
									</Box>
									{professional.rating && (
										<Box display="flex" alignItems="center">
											<StarIcon sx={{
												color: 'warning.main',
												fontSize: '1rem',
												mr: 0.5,
												opacity: selectedProfessional?.id === professional.id ? 1 : 0.8
											}} />
											<Typography variant="body2" color="text.secondary">
												{professional.rating}
											</Typography>
										</Box>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default ProfessionalList;