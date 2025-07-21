import React from 'react';
import { Box, Avatar, Typography, Card, CardContent, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const professionals = [
	{
		id: 1,
		name: 'Any professional',
		rating: '4.9',
		role: 'for maximum availability',
		avatarUrl: null,
	},
	{
		id: 2,
		name: 'Hanna',
		rating: '4.9',
		role: 'Hairdresser',
		avatarUrl: null,
	},
	{
		id: 3,
		name: 'Male Hairdresser',
		rating: '4.5',
		role: 'Hairdresser',
		avatarUrl: null,
	},
	{
		id: 4,
		name: 'Hanna',
		rating: '4.9',
		role: 'Hairdresser',
		avatarUrl: null,
	},
	{
		id: 5,
		name: 'Male Hairdresser',
		rating: '4.5',
		role: 'Hairdresser',
		avatarUrl: null,
	},
	{
		id: 6,
		name: 'Hanna',
		rating: '4.9',
		role: 'Hairdresser',
		avatarUrl: null,
	},
	{
		id: 7,
		name: 'Male Hairdresser',
		rating: '4.5',
		role: 'Hairdresser',
		avatarUrl: null,
	},
];

const ProfessionalList = ({ onProfessionalSelect, selectedProfessional }) => {
	return (
		<Box
			sx={{
				width: '100%',
				overflow: 'hidden',
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
							xs={8} // Reduced from 10 to 8 for smaller width
							sm={6}
							md={4}
							key={professional.id}
							sx={{
								minWidth: { xs: '180px', sm: '180px' }, // Reduced from 260px to 200px
								maxWidth: { xs: '200px', sm: 'none' }, // Reduced from 300px to 240px
							}}
						>
							<Card
								sx={{
									height: { xs: '150px', sm: '210px' }, // Reduced height on mobile
									cursor: 'pointer',
									border:
										selectedProfessional?.id === professional.id
											? '2px solid #0D9488'
											: '1px solid #e0e0e0',
									backgroundColor:
										selectedProfessional?.id === professional.id
											? '#E6FFFA' // Light teal background for selected card
											: 'white',
									'&:hover': {
										backgroundColor:
											selectedProfessional?.id === professional.id
												? '#E6FFFA'
												: '#f8f8f8',
									},
									display: 'flex',
									flexDirection: 'column',
									transition: 'all 0.2s ease-in-out',
									'&:active': {
										// Better touch feedback
										transform: 'scale(0.98)',
									},
								}}
								onClick={() => onProfessionalSelect(professional)}
							>
								<CardContent
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										textAlign: 'center',
										height: '100%',
										p: { xs: 1.5, sm: 3 }, // Reduced padding on mobile
									}}
								>
									<Avatar
										sx={{
											width: { xs: 50, sm: 80 }, // Reduced from 60px to 50px
											height: { xs: 50, sm: 80 },
											mb: { xs: 1, sm: 1.5 },
											bgcolor: '#0D9488',
										}}
									>
										{professional.avatarUrl ? (
											<img
												src={professional.avatarUrl}
												alt={professional.name}
											/>
										) : (
											professional.name[0]
										)}
									</Avatar>
									<Typography
										variant="h6"
										gutterBottom
										sx={{
											fontSize: { xs: '0.875rem', sm: '1.25rem' }, // Reduced font size
											mb: 0.5,
										}}
									>
										{professional.name}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{
											mb: 1,
											fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Reduced font size
										}}
									>
										{professional.role}
									</Typography>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 0.5,
											color: '#0D9488',
										}}
									>
										<StarIcon
											sx={{
												fontSize: { xs: '0.75rem', sm: '0.875rem' },
											}}
										/>
										<Typography
											variant="body2"
											sx={{
												fontSize: { xs: '0.75rem', sm: '0.875rem' },
											}}
										>
											{professional.rating}
										</Typography>
									</Box>
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